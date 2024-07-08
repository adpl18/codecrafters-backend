const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, Availability, User } = require('../../models');

let testUser;
let testAvailability;
let server;
let port;

beforeAll(async () => {
  

  // Sincroniza el modelo con la base de datos

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
  // Elimina el usuario y la disponibilidad de prueba
  if (testAvailability) {
    await Availability.destroy({ where: { id: testAvailability.id } });
  }
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }

  // Cierra el servidor después de los tests
  server.close(async () => {
    await sequelize.close();
  });
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

  it('should delete an availability', async () => {
    const response = await request(server).delete(`/availabilities/${testAvailability.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Availability deleted successfully');

    // Verifica que la disponibilidad ha sido eliminada
    const checkAvailability = await Availability.findByPk(testAvailability.id);
    expect(checkAvailability).toBeNull();
  });
});
