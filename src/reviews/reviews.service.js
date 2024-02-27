const db = require("../db/connection");
const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName).where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  const reviews = await db(tableName)
    .select("*")
    .where({ movie_id });
  const data = [];
  for (const review of reviews) {
    let criticAddedReview = await setCritic(review);
    data.push(criticAddedReview);
  }
  return data;
}

async function read(reviewId) {
  return db(tableName)
    .select("*")
    .where({ review_id : reviewId })
    .first()
    .then(setCritic);
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
