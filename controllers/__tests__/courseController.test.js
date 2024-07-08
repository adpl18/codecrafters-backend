const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Course, User } = require('../../models');

let testUser;
let testCourse;
let server;
let port;

beforeAll(async () => {

  // Crea un usuario de prueba
  testUser = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    birthdate: '2000-01-01'
  });
  if (server) {
    server.close();
  };
  port = Math.floor(Math.random() * 40000) + 10000; // Puerto aleatorio entre 10000 y 50000
  server = app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
  });
});

afterAll(async () => {
  // Elimina el curso y el usuario de prueba
  if (testCourse) {
    await Course.destroy({ where: { id: testCourse.id } });
  }
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }

  // Cierra el servidor después de los tests
  server.close(async () => {
    await sequelize.close();
  });
});

describe('Course Controller', () => {
  it('should create a course', async () => {
    const courseData = {
      name: 'Math 101',
      price: 100,
      description: 'Basic Math Course',
      category: 'Math',
      userId: testUser.id
    };

    const response = await request(server)
      .post('/courses')
      .send(courseData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('course');
    expect(response.body.course).toHaveProperty('id');

    testCourse = response.body.course;
  });

  it('should get all courses', async () => {
    const response = await request(server).get('/courses');
    expect(response.status).toBe(200);
    expect(response.body.courses).toBeDefined();
  });

  it('should get a course by ID', async () => {
    const response = await request(server).get(`/courses/${testCourse.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('course');
    expect(response.body.course).toHaveProperty('id', testCourse.id);
  });

  it('should update a course', async () => {
    const updatedData = {
      name: 'Math 102',
      price: 150,
      description: 'Intermediate Math Course',
      category: 'Math'
    };

    const response = await request(server)
      .put(`/courses/${testCourse.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('course');
    expect(response.body.course).toMatchObject(updatedData);
  });

  it('should delete a course', async () => {
    const response = await request(server).delete(`/courses/${testCourse.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Course deleted successfully');

    // Verifica que el curso ha sido eliminado
    const checkCourse = await Course.findByPk(testCourse.id);
    expect(checkCourse).toBeNull();
  });
});
