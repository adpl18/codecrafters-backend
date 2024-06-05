const { Review } = require('../models');

async function getReviews(ctx) {
  try {
    const reviews = await Review.findAll();
    ctx.status = 200;
    ctx.body = { reviews };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'An error occurred while fetching reviews.' };
    console.error('Error fetching reviews:', error);
  }
}

async function getReviewById(ctx) {
  const reviewId = parseInt(ctx.params.id);
  if (!reviewId || reviewId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid review ID' };
    return;
  }

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
    } else {
      ctx.status = 200;
      ctx.body = { review };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error fetching review by ID:', error);
  }
}

async function createReview(ctx) {
  const { rating, comment, reservationId } = ctx.request.body;
  if (!rating || !comment || !reservationId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  try {
    const review = await Review.create({ rating, comment, reservationId });
    ctx.status = 201;
    ctx.body = { review };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error creating review:', error);
  }
}

async function updateReview(ctx) {
  const reviewId = parseInt(ctx.params.id);
  if (!reviewId || reviewId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid review ID' };
    return;
  }

  const { rating, comment, reservationId } = ctx.request.body;
  if (!rating || !comment || !reservationId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields' };
    return;
  }

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
      return;
    }

    await review.update({ rating, comment, reservationId });
    ctx.status = 200;
    ctx.body = { review };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error updating review:', error);
  }
}

async function deleteReview(ctx) {
  const reviewId = parseInt(ctx.params.id);
  if (!reviewId || reviewId < 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid review ID' };
    return;
  }

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      ctx.status = 404;
      ctx.body = { error: 'Review not found' };
      return;
    }

    await review.destroy();
    ctx.status = 200;
    ctx.body = { message: 'Review deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
    console.error('Error deleting review:', error);
  }
}

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
