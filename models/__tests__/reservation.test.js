/* eslint-disable no-undef */
const { Reservation, User, Course, Availability } = require('../../models');

describe('Reservation Model', () => {
  let user, course, availability, reservation;

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
  });

  test('should create a reservation', async () => {
    expect(reservation).toBeDefined();
    expect(reservation.id).toBeDefined();
    expect(reservation.isCancelled).toBe(false);
    expect(reservation.courseId).toBe(course.id);
    expect(reservation.userId).toBe(user.id);
    expect(reservation.availabilityId).toBe(availability.id);
  });

  test('should update a reservation', async () => {
    await reservation.update({
      isCancelled: true
    });

    const updatedReservation = await Reservation.findByPk(reservation.id);

    expect(updatedReservation).toBeDefined();
    expect(updatedReservation.isCancelled).toBe(true);
  });

  test('should delete a reservation', async () => {
    await reservation.destroy();

    const deletedReservation = await Reservation.findByPk(reservation.id);

    expect(deletedReservation).toBeNull();
  });
});
