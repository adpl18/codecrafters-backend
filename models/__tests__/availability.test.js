/* eslint-disable no-undef */

const { Availability, User } = require('../../models');

describe('Availability Model', () => {
  let user, availability;

  beforeEach(async () => {
    user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    });

    availability = await Availability.create({
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      isAvailable: true,
      userId: user.id
    });
  });

  test('should create an availability', async () => {
    expect(availability).toBeDefined();
    expect(availability.id).toBeDefined();
    expect(availability.date).toBe('2024-06-18');
    expect(availability.startTime).toBe('09:00:00');
    expect(availability.endTime).toBe('12:00:00');
    expect(availability.isAvailable).toBe(true);
    expect(availability.userId).toBe(user.id);
  });

  test('should update an availability', async () => {
    await availability.update({
      startTime: '10:00:00',
      endTime: '13:00:00',
      isAvailable: false
    });

    const updatedAvailability = await Availability.findByPk(availability.id);

    expect(updatedAvailability).toBeDefined();
    expect(updatedAvailability.startTime).toBe('10:00:00');
    expect(updatedAvailability.endTime).toBe('13:00:00');
    expect(updatedAvailability.isAvailable).toBe(false);
  });

  test('should delete an availability', async () => {
    await availability.destroy();

    const deletedAvailability = await Availability.findByPk(availability.id);

    expect(deletedAvailability).toBeNull();
  });
});
