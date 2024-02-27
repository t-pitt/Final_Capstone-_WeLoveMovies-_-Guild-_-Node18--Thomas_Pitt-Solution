const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  try {
    const movie = await service.read(request.params.movieId);
    if (movie) {
      response.locals.movie = movie;
      return next();
    }
  } catch (error) { /* Do nothing with the error and return 404 below */}
  next({ status: 404, message: `Movie cannot be found.` });
}

async function read(request, response) {
  const { movie: data } = response.locals;
  response.json({ data });
}

async function list(request, response) {
  const isShowingParam = request.query.is_showing;
  const isShowing = isShowingParam ? (isShowingParam === "true") : false;
  const data = await service.list(isShowing);
  response.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
