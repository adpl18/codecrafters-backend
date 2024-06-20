/* eslint-disable no-undef */
const { Review, Reservation, User, Course, Availability } = require('../../models');

describe('Review Model', () => {
  let user, course, availability, reservation, review;

  beforeEach(async () => {
    user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    });

    course = await Course.create({
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: user.id
    });

    availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id
    });

    reservation = await Reservation.create({
      isCancelled: false,
      courseId: course.id,
      userId: user.id,
      availabilityId: availability.id
    });

    review = await Review.create({
      rating: 5,
      comment: 'Great course!',
      reservationId: reservation.id
    });
  });

  test('should create a review', async () => {
    expect(review).toBeDefined();
    expect(review.id).toBeDefined();
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Great course!');
    expect(review.reservationId).toBe(reservation.id);
  });

  test('should update a review', async () => {
    await review.update({
      rating: 4,
      comment: 'Good course!'
    });

    const updatedReview = await Review.findByPk(review.id);

    expect(updatedReview).toBeDefined();
    expect(updatedReview.rating).toBe(4);
    expect(updatedReview.comment).toBe('Good course!');
  });

  test('should delete a review', async () => {
    await review.destroy();

    const deletedReview = await Review.findByPk(review.id);

    expect(deletedReview).toBeNull();
  });
});
