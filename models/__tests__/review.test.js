/* eslint-disable no-undef */
const { Review, Reservation, User, Course, Availability } = require('../../models');

describe('Review Model Unit Tests', () => {
  test('should create a review', async () => {
    const user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    });

    const course = await Course.create({
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: user.id
    });

    const availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id
    });

    const reservation = await Reservation.create({
      isCancelled: false,
      courseId: course.id,
      userId: user.id,
      availabilityId: availability.id
    });

    const review = await Review.create({
      rating: 5,
      comment: 'Great course!',
      reservationId: reservation.id
    });

    expect(review).toBeDefined();
    expect(review.id).toBeDefined();
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Great course!');
    expect(review.reservationId).toBe(reservation.id);
  });

  // Add more unit tests as needed
});

describe('Review Model Integration Tests', () => {
  let user, course, availability, reservation;

  test('should create and fetch a review with reservation', async () => {
    user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01',
    });

    course = await Course.create({
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: user.id,
    });

    availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id,
    });

    reservation = await Reservation.create({
      isCancelled: false,
      courseId: course.id,
      userId: user.id,
      availabilityId: availability.id,
    });
    
    const review = await Review.create({
      rating: 5,
      comment: 'Great course!',
      reservationId: reservation.id,
    });

    const fetchedReview = await Review.findByPk(review.id, {
      include: {
        model: Reservation,
        include: [User, Course, Availability]
      }
    });

    expect(fetchedReview).toBeDefined();
    expect(fetchedReview.Reservation).toBeDefined();
    expect(fetchedReview.Reservation.User).toBeDefined();
    expect(fetchedReview.Reservation.User.email).toBe('john.doe@example.com');
    expect(fetchedReview.Reservation.Course).toBeDefined();
    expect(fetchedReview.Reservation.Course.name).toBe('Math 101');
    expect(fetchedReview.Reservation.Availability).toBeDefined();
    expect(fetchedReview.Reservation.Availability.date).toBe('2024-06-18');
  });
});
