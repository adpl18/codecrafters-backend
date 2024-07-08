const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Review, Reservation, Course, User, Availability } = require('../../models');

let testUser;
let testCourse;
let testAvailability;
let testReservation;
let testReview;
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

  // Crea una reserva de prueba
  testReservation = await Reservation.create({
    courseId: testCourse.id,
    userId: testUser.id,
    availabilityId: testAvailability.id,
    isCancelled: false
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
  // Elimina las reseñas, las reservas, el curso, la disponibilidad y el usuario de prueba
  if (testReview) {
    await Review.destroy({ where: { id: testReview.id } });
  }
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

describe('Review Controller', () => {
  it('should create a review', async () => {
    const reviewData = {
      rating: 5,
      comment: 'Great course!',
      reservationId: testReservation.id
    };

    const response = await request(server)
      .post('/reviews')
      .send(reviewData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('review');
    expect(response.body.review).toHaveProperty('id');

    testReview = response.body.review;
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(server)
      .post('/reviews')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should get all reviews', async () => {
    const response = await request(server).get('/reviews');
    expect(response.status).toBe(200);
    expect(response.body.reviews).toBeDefined();
  });

  it('should get a review by ID', async () => {
    const response = await request(server).get(`/reviews/${testReview.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('review');
    expect(response.body.review).toHaveProperty('id', testReview.id);
  });

  it('should return 400 for invalid review ID', async () => {
    const response = await request(server).get('/reviews/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid review ID');
  });

  it('should return 404 if review is not found', async () => {
    const response = await request(server).get('/reviews/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Review not found');
  });

  it('should update a review', async () => {
    const updatedData = {
      rating: 4,
      comment: 'Good course',
      reservationId: testReservation.id
    };

    const response = await request(server)
      .put(`/reviews/${testReview.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('review');
    expect(response.body.review).toMatchObject(updatedData);
  });

  it('should return 400 for invalid update review ID', async () => {
    const response = await request(server).put('/reviews/invalid').send({
      rating: 4,
      comment: 'Good course',
      reservationId: testReservation.id
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid review ID');
  });

  it('should return 404 if review to update is not found', async () => {
    const response = await request(server).put('/reviews/99999').send({
      rating: 4,
      comment: 'Good course',
      reservationId: testReservation.id
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Review not found');
  });

  it('should return 400 if required fields are missing for update', async () => {
    const response = await request(server).put(`/reviews/${testReview.id}`).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should delete a review', async () => {
    const response = await request(server).delete(`/reviews/${testReview.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Review deleted successfully');

    // Verifica que la reseña ha sido eliminada
    const checkReview = await Review.findByPk(testReview.id);
    expect(checkReview).toBeNull();
  });

  it('should return 400 for invalid delete review ID', async () => {
    const response = await request(server).delete('/reviews/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid review ID');
  });

  it('should return 404 if review to delete is not found', async () => {
    const response = await request(server).delete('/reviews/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Review not found');
  });
});
