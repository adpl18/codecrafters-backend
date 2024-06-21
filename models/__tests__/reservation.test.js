/* eslint-disable no-undef */
const { Reservation, User, Course, Availability } = require('../../models');

describe('Reservation Model Unit Tests', () => {
  test('should create a reservation', async () => {
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

    expect(reservation).toBeDefined();
    expect(reservation.id).toBeDefined();
    expect(reservation.isCancelled).toBe(false);
    expect(reservation.courseId).toBe(course.id);
    expect(reservation.userId).toBe(user.id);
    expect(reservation.availabilityId).toBe(availability.id);
  });

  // Add more unit tests as needed
});

describe('Reservation Model Integration Tests', () => {
  let user, course, availability;

  test('should create and fetch a reservation with course, user, and availability', async () => {
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
    const reservation = await Reservation.create({
      isCancelled: false,
      courseId: course.id,
      userId: user.id,
      availabilityId: availability.id,
    });

    const fetchedReservation = await Reservation.findByPk(reservation.id, {
      include: [User, Course, Availability]
    });

    expect(fetchedReservation).toBeDefined();
    expect(fetchedReservation.User).toBeDefined();
    expect(fetchedReservation.User.email).toBe('john.doe@example.com');
    expect(fetchedReservation.Course).toBeDefined();
    expect(fetchedReservation.Course.name).toBe('Math 101');
    expect(fetchedReservation.Availability).toBeDefined();
    expect(fetchedReservation.Availability.date).toBe('2024-06-18');
  });
});
