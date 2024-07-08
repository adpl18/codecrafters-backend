const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Course, User, Reservation, Availability } = require('../../models');

let testUser;
let testCourse;
let testReservation;
let testAvailability;
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
  // Elimina el curso, la reserva, la disponibilidad y el usuario de prueba
  if (testCourse) {
    await Course.destroy({ where: { id: testCourse.id } });
  }
  if (testReservation) {
    await Reservation.destroy({ where: { id: testReservation.id } });
  }
  if (testAvailability) {
    await Availability.destroy({ where: { id: testAvailability.id } });
  }
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }

  // Cierra el servidor después de los tests
  await new Promise(resolve => server.close(resolve));
  await sequelize.close();
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

  it('should return 400 if required fields are missing', async () => {
    const response = await request(server)
      .post('/courses')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
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

  it('should return 400 for invalid course ID', async () => {
    const response = await request(server).get('/courses/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid course ID');
  });

  it('should return 404 if course is not found', async () => {
    const response = await request(server).get('/courses/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Course not found');
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

  it('should return 400 for invalid update course ID', async () => {
    const response = await request(server).put('/courses/invalid').send({
      name: 'Math 102',
      price: 150,
      description: 'Intermediate Math Course',
      category: 'Math'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid course ID');
  });

  it('should return 404 if course to update is not found', async () => {
    const response = await request(server).put('/courses/99999').send({
      name: 'Math 102',
      price: 150,
      description: 'Intermediate Math Course',
      category: 'Math'
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Course not found');
  });

  it('should return 400 if required fields are missing for update', async () => {
    const response = await request(server).put(`/courses/${testCourse.id}`).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should delete a course', async () => {
    const response = await request(server).delete(`/courses/${testCourse.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Course deleted successfully');

    // Verifica que el curso ha sido eliminado
    const checkCourse = await Course.findByPk(testCourse.id);
    expect(checkCourse).toBeNull();
  });

  it('should return 400 for invalid delete course ID', async () => {
    const response = await request(server).delete('/courses/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid course ID');
  });

  it('should return 404 if course to delete is not found', async () => {
    const response = await request(server).delete('/courses/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Course not found');
  });



  it('should return 400 for invalid teacher ID', async () => {
    const response = await request(server).get('/courses/teacher/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid teacher ID');
  });

  it('should return 404 if no courses are found for the teacher', async () => {
    const response = await request(server).get('/courses/teacher/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No courses found for this teacher');
  });

  it('should return 404 if course to update price is not found', async () => {
    const response = await request(server).put('/courses/99999/price').send({
      newPrice: 200
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Course not found');
  });
});
