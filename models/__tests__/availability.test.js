/* eslint-disable no-undef */
const { Availability, User } = require('../../models');

describe('Availability Model Unit Tests', () => {
  test('should create an availability', async () => {
    const user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    });

    const availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id
    });

    expect(availability).toBeDefined();
    expect(availability.id).toBeDefined();
    expect(availability.date).toBe('2024-06-18');
    expect(availability.startTime).toBe('09:00:00');
    expect(availability.endTime).toBe('12:00:00');
    expect(availability.isAvailable).toBe(true);
    expect(availability.userId).toBe(user.id);
  });

  // Add more unit tests as needed
});

describe('Availability Model Integration Tests', () => {
  let user;

  test('should create and fetch an availability with user', async () => {
    user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01',
    });

    const availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id
    });

    const fetchedAvailability = await Availability.findByPk(availability.id, {
      include: User
    });

    expect(fetchedAvailability).toBeDefined();
    expect(fetchedAvailability.User).toBeDefined();
    expect(fetchedAvailability.User.email).toBe('john.doe@example.com');
  });
});
