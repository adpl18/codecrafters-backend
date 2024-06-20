/* eslint-disable no-undef */
const { Course, User } = require('../../models');

describe('Course Model', () => {
  let user, course;

  beforeEach(async () => {
    user = await User.create({
      firstName: 'Johnny2',
      lastName: 'Test2',
      email: 'john.doe2@example.com',
      birthdate: '1990-01-01'
    });

    course = await Course.create({
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: user.id
    });
  });

  test('should create a course', async () => {
    expect(course).toBeDefined();
    expect(course.id).toBeDefined();
    expect(course.name).toBe('Math 101');
    expect(course.price).toBe(100);
    expect(course.description).toBe('Basic Math Course');
    expect(course.category).toBe('Math');
    expect(course.userId).toBe(user.id);
  });

  test('should update a course', async () => {
    await course.update({
      name: 'Advanced Math 101',
      price: 150,
      description: 'Advanced Math Course'
    });

    const updatedCourse = await Course.findByPk(course.id);

    expect(updatedCourse).toBeDefined();
    expect(updatedCourse.name).toBe('Advanced Math 101');
    expect(updatedCourse.price).toBe(150);
    expect(updatedCourse.description).toBe('Advanced Math Course');
  });

  test('should delete a course', async () => {
    await course.destroy();

    const deletedCourse = await Course.findByPk(course.id);

    expect(deletedCourse).toBeNull();
  });
});
