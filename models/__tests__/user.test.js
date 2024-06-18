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
  });

//     const course = await Course.create({
//       name: 'Mathematics 101',
//       price: 50,
//       description: 'Introduction to Mathematics',
//       userId: user.id
//     });

//     expect(course).toBeDefined();
//     expect(course.name).toBe('Mathematics 101');
//     expect(course.price).toBe(50);
//     expect(course.description).toBe('Introduction to Mathematics');
//     expect(course.userId).toBe(user.id);
//   });

});
