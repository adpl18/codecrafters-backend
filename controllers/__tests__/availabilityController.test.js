const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Availability, User } = require('../../models');

let testUser;
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
  // Elimina la disponibilidad y el usuario de prueba
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

describe('Availability Controller', () => {
  it('should create an availability', async () => {
    const availabilityData = {
      date: '2024-06-18',
      startTime: '09:00:00',
      endTime: '12:00:00',
      userId: testUser.id
    };

    const response = await request(server)
      .post('/availabilities')
      .send(availabilityData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('availability');
    expect(response.body.availability).toHaveProperty('id');

    testAvailability = response.body.availability;
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(server)
      .post('/availabilities')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should get all availabilities', async () => {
    const response = await request(server).get('/availabilities');
    expect(response.status).toBe(200);
    expect(response.body.availabilities).toBeDefined();
  });

  it('should get an availability by ID', async () => {
    const response = await request(server).get(`/availabilities/${testAvailability.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('availability');
    expect(response.body.availability).toHaveProperty('id', testAvailability.id);
  });

  it('should return 400 for invalid availability ID', async () => {
    const response = await request(server).get('/availabilities/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid availability ID');
  });

  it('should return 404 if availability is not found', async () => {
    const response = await request(server).get('/availabilities/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Availability not found');
  });

  it('should update an availability', async () => {
    const updatedData = {
      date: '2024-06-19',
      startTime: '10:00:00',
      endTime: '13:00:00'
    };

    const response = await request(server)
      .put(`/availabilities/${testAvailability.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('availability');
    expect(response.body.availability).toMatchObject(updatedData);
  });

  it('should return 400 for invalid update availability ID', async () => {
    const response = await request(server).put('/availabilities/invalid').send({
      date: '2024-06-19',
      startTime: '10:00:00',
      endTime: '13:00:00'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid availability ID');
  });

  it('should return 404 if availability to update is not found', async () => {
    const response = await request(server).put('/availabilities/99999').send({
      date: '2024-06-19',
      startTime: '10:00:00',
      endTime: '13:00:00'
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Availability not found');
  });

  it('should return 400 if required fields are missing for update', async () => {
    const response = await request(server).put(`/availabilities/${testAvailability.id}`).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should delete an availability', async () => {
    const response = await request(server).delete(`/availabilities/${testAvailability.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Availability deleted successfully');

    // Verifica que la disponibilidad ha sido eliminada
    const checkAvailability = await Availability.findByPk(testAvailability.id);
    expect(checkAvailability).toBeNull();
  });

  it('should return 400 for invalid delete availability ID', async () => {
    const response = await request(server).delete('/availabilities/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid availability ID');
  });

  it('should return 404 if availability to delete is not found', async () => {
    const response = await request(server).delete('/availabilities/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Availability not found');
  });

  it('should return 400 for invalid user ID', async () => {
    const response = await request(server).get('/availabilities/user/invalid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  it('should return 404 if no availabilities are found for the user', async () => {
    const response = await request(server).get('/availabilities/user/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No availabilities found for this user');
  });

  it('should get availabilities by date range', async () => {
    const response = await request(server).post('/availabilities/daterange').send({
      startDate: '2024-06-01',
      endDate: '2024-06-30'
    });
    expect(response.status).toBe(200);
    expect(response.body.availabilities).toBeDefined();
  });

  it('should return 400 if start date or end date is missing', async () => {
    const response = await request(server).post('/availabilities/daterange').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Start date and end date are required');
  });

  it('should return 404 if no availabilities are found in the date range', async () => {
    const response = await request(server).post('/availabilities/daterange').send({
      startDate: '1999-01-01',
      endDate: '1999-12-31'
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No availabilities found in the specified date range');
  });

  it('should return 400 for invalid availability status update ID', async () => {
    const response = await request(server).put('/availabilities/update-status/invalid').send({
      isAvailable: false
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid availability ID');
  });

  it('should return 404 if availability to update status is not found', async () => {
    const response = await request(server).put('/availabilities/update-status/99999').send({
      isAvailable: false
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Availability not found');
  });

  it('should return 400 for invalid isAvailable value', async () => {
    const response = await request(server).put(`/availabilities/update-status/${testAvailability.id}`).send({
      isAvailable: 'invalid'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid isAvailable value, it should be boolean');
  });
});
