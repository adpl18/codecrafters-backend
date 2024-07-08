const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Reservation, Course, User, Availability } = require('../../models');

let testUser;
let testCourse;
let testAvailability;
let testReservation;
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

  // Crea un curso de prueba
  testCourse = await Course.create({
    name: 'Math 101',
    price: 100,
    description: 'Basic Math Course',
    category: 'Math',
    userId: testUser.id
  });

  // Crea una disponibilidad de prueba
  testAvailability = await Availability.create({
    date: '2024-06-18',
    startTime: '09:00:00',
    endTime: '12:00:00',
    isAvailable: true,
    userId: testUser.id
  });

  if (server) {
    server.close();
  }
  port = Math.floor(Math.random() * 40000) + 10000; // Puerto aleatorio entre 10000 y 50000
  server = app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
  });
});

afterAll(async () => {
  // Elimina las reservas, el curso, la disponibilidad y el usuario de prueba
  if (testReservation) {
    await Reservation.destroy({ where: { id: testReservation.id } });
  }
  if (testCourse) {
    await Course.destroy({ where: { id: testCourse.id } });
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

describe('Reservation Controller', () => {
  it('should create a reservation', async () => {
    const reservationData = {
      courseId: testCourse.id,
      userId: testUser.id,
      availabilityId: testAvailability.id
    };

    const response = await request(server)
      .post('/reservations')
      .send(reservationData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('reservation');
    expect(response.body.reservation).toHaveProperty('id');

    testReservation = response.body.reservation;
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(server)
      .post('/reservations')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should get all reservations', async () => {
    const response = await request(server).get('/reservations');
    expect(response.status).toBe(200);
    expect(response.body.reservations).toBeDefined();
  });

  it('should get a reservation by ID', async () => {
    const response = await request(server).get(`/reservations/${testReservation.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reservation');
    expect(response.body.reservation).toHaveProperty('id', testReservation.id);
  });

  it('should return 400 for invalid reservation ID', async () => {
    const response = await request(server).get('/reservations/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid reservation ID');
  });

  it('should return 404 if reservation is not found', async () => {
    const response = await request(server).get('/reservations/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Reservation not found');
  });

  it('should delete a reservation', async () => {
    const response = await request(server).delete(`/reservations/${testReservation.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Reservation deleted successfully');

    // Verifica que la reserva ha sido eliminada
    const checkReservation = await Reservation.findByPk(testReservation.id);
    expect(checkReservation).toBeNull();
  });

  it('should return 400 for invalid delete reservation ID', async () => {
    const response = await request(server).delete('/reservations/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid reservation ID');
  });

  it('should return 404 if reservation to delete is not found', async () => {
    const response = await request(server).delete('/reservations/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Reservation not found');
  });

  it('should get reservations by user ID', async () => {
    const reservationData = {
      courseId: testCourse.id,
      userId: testUser.id,
      availabilityId: testAvailability.id
    };

    await Reservation.create(reservationData);

    const response = await request(server).get(`/reservations/user/${testUser.id}`);
    expect(response.status).toBe(200);
    expect(response.body.reservations).toBeDefined();
    expect(response.body.reservations.length).toBeGreaterThan(0);
  });

  it('should return 400 for invalid user ID', async () => {
    const response = await request(server).get('/reservations/user/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  it('should return 404 if no reservations found for user', async () => {
    const response = await request(server).get('/reservations/user/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No reservations found for this user');
  });

  it('should get reservations by course ID', async () => {
    const reservationData = {
      courseId: testCourse.id,
      userId: testUser.id,
      availabilityId: testAvailability.id
    };

    await Reservation.create(reservationData);

    const response = await request(server).get(`/reservations/course/${testCourse.id}`);
    expect(response.status).toBe(200);
    expect(response.body.reservations).toBeDefined();
    expect(response.body.reservations.length).toBeGreaterThan(0);
  });

  it('should return 400 for invalid course ID', async () => {
    const response = await request(server).get('/reservations/course/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid course ID');
  });

  it('should return 404 if no reservations found for course', async () => {
    const response = await request(server).get('/reservations/course/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No reservations found for this course');
  });

  it('should cancel a reservation', async () => {
    // Create a new reservation for testing cancellation
    const newReservation = await Reservation.create({
      courseId: testCourse.id,
      userId: testUser.id,
      availabilityId: testAvailability.id,
      isCancelled: false
    });

    const response = await request(server).put(`/reservations/cancel/${newReservation.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Reservation cancelled successfully');

    const updatedReservation = await Reservation.findByPk(newReservation.id);
    expect(updatedReservation.isCancelled).toBe(true);
  });

  it('should return 400 for invalid cancel reservation ID', async () => {
    const response = await request(server).put('/reservations/cancel/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid reservation ID');
  });

  it('should return 404 if reservation to cancel is not found', async () => {
    const response = await request(server).put('/reservations/cancel/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Reservation not found');
  });

  it('should return 404 if no reservations found for date', async () => {
    const response = await request(server).get('/reservations/date/1999-01-01');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No reservations found for this date');
  });
});
