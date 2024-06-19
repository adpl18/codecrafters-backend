/* eslint-disable no-undef */
const { Course, User } = require('../../models');

describe('Course Model', () => {

  test('should create a course', async () => {
    const user = await User.create({
      firstName: 'Johnny2',
      lastName: 'Test2',
      email: 'john.doe2@example.com',
      birthdate: '1990-01-01'
    });

    const course = await Course.create({
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: user.id
    });

    expect(course).toBeDefined();
    expect(course.id).toBeDefined();
    expect(course.name).toBe('Math 101');
    expect(course.price).toBe(100);
    expect(course.description).toBe('Basic Math Course');
    expect(course.category).toBe('Math');
    expect(course.userId).toBe(user.id);
  });

  // Add more tests as needed
});
