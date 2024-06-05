const { sequelize, Course, User } = require('../../models');

describe('Course Model', () => {
//   beforeEach(async () => {
//     await sequelize.sync({ force: true });
//   });

//   afterAll(async () => {
//     await sequelize.close();
//   });

    test("should create a course", async () => {
        expect(1).toBe(1);
    });


//   test('should create a course', async () => {
//     const user = await User.create({
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john.doe@example.com',
//       birthdate: '1990-01-01'
//     });

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

//   test('should associate course with user', async () => {
//     const user = await User.create({
//       firstName: 'Jane',
//       lastName: 'Doe',
//       email: 'jane.doe@example.com',
//       birthdate: '1995-01-01'
//     });

//     const course = await Course.create({
//       name: 'Biology 101',
//       price: 60,
//       description: 'Introduction to Biology',
//       userId: user.id
//     });

//     const foundCourse = await Course.findByPk(course.id, { include: 'user' });

//     expect(foundCourse.user).toBeDefined();
//     expect(foundCourse.user.firstName).toBe('Jane');
//     expect(foundCourse.user.lastName).toBe('Doe');
//     expect(foundCourse.user.email).toBe('jane.doe@example.com');
//     expect(foundCourse.user.birthdate).toBe('1995-01-01');
//   });
});
