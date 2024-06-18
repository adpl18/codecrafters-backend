/* eslint-disable no-undef */
const { sequelize, User } = require('../../models');

describe('User Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create a user', async () => {
    const user = await User.create({
      firstName: 'Johnny',
      lastName: 'Test',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined(); // Ensure user has an ID after creation
    expect(user.firstName).toBe('Johnny');
    expect(user.lastName).toBe('Test');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.birthdate.toISOString()).toBe('1990-01-01T00:00:00.000Z'); // Check birthdate format
  });

  test('should fetch a user by ID', async () => {
    const createdUser = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      birthdate: '1995-05-05'
    });

    const fetchedUser = await User.findByPk(createdUser.id);

    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.id).toBe(createdUser.id);
    expect(fetchedUser.firstName).toBe('Jane');
    expect(fetchedUser.lastName).toBe('Doe');
    expect(fetchedUser.email).toBe('jane.doe@example.com');
    expect(fetchedUser.birthdate.toISOString()).toBe('1995-05-05T00:00:00.000Z');
  });

  test('should update a user', async () => {
    const createdUser = await User.create({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      birthdate: '1985-08-15'
    });

    await User.update(
      {
        firstName: 'UpdatedAlice',
        lastName: 'UpdatedSmith'
      },
      {
        where: { id: createdUser.id }
      }
    );

    // Fetch the user again to ensure updates were applied
    const fetchedUser = await User.findByPk(createdUser.id);

    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.firstName).toBe('UpdatedAlice');
    expect(fetchedUser.lastName).toBe('UpdatedSmith');
  });

  test('should delete a user', async () => {
    const createdUser = await User.create({
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@example.com',
      birthdate: '1980-12-10'
    });

    await User.destroy({ where: { id: createdUser.id } });

    // Attempt to fetch the user again
    const fetchedUser = await User.findByPk(createdUser.id);

    expect(fetchedUser).toBeNull(); // User should no longer exist
  });
});

