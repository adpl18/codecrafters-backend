const request = require('supertest');
const app = require('../../app'); // Ajusta la ruta según sea necesario
const { sequelize, User } = require('../../models'); // Asegúrate de que la ruta sea correcta

let testUser;
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
  // Elimina el usuario de prueba
  if (testUser) {
    await User.destroy({ where: { id: testUser.id } });
  }

  // Cierra el servidor después de los tests
  await sequelize.close();
  server.close();
});

describe('Koa App Endpoints', () => {
  it('should respond with a 200 status code on GET /users', async () => {
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.users).toContainEqual(expect.objectContaining({
      id: testUser.id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com'
    }));
  });

  it('should respond with a 200 status code and user data on GET /users/:id', async () => {
    const response = await request(server).get(`/users/${testUser.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id', testUser.id);
  });

  it('should respond with a 404 status code when user is not found on GET /users/:id', async () => {
    const nonExistentUserId = 9999; // Asegúrate de que este ID no exista en tu base de datos
    const response = await request(server).get(`/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should respond with a 400 status code when user ID is invalid on GET /users/:id', async () => {
    const invalidUserId = 'invalid'; // Un ID inválido
    const response = await request(server).get(`/users/${invalidUserId}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  it('should respond with a 201 status code and the created user on POST /users', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthdate: '1990-01-01'
    };

    const response = await request(server)
      .post('/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');

    // Ajustar el formato de la fecha
    const expectedUser = { ...newUser, birthdate: new Date(newUser.birthdate).toISOString() };
    expect(response.body.user).toMatchObject(expectedUser);
  });

  it('should respond with a 400 status code when missing required fields on POST /users', async () => {
    const incompleteUser = {
      firstName: 'John'
      // Missing lastName, email, and birthdate
    };

    const response = await request(server)
      .post('/users')
      .send(incompleteUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should respond with a 400 status code when birthdate is invalid on POST /users', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      birthdate: 'invalid-date'
    };

    const response = await request(server)
      .post('/users')
      .send(newUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid birthdate');
  });

  it('should respond with a 400 status code when user is under 18 years old on POST /users', async () => {
    const newUser = {
      firstName: 'Young',
      lastName: 'User',
      email: 'young.user@example.com',
      birthdate: '2010-01-01'
    };

    const response = await request(server)
      .post('/users')
      .send(newUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'You must be at least 18 years old to sign up.');
  });

  it('should respond with a 200 status code and the updated user on PUT /users/:id', async () => {
    const updatedUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      birthdate: '1985-01-01'
    };

    const response = await request(server)
      .put(`/users/${testUser.id}`)
      .send(updatedUser);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');

    // Ajustar el formato de la fecha
    const expectedUser = { ...updatedUser, birthdate: new Date(updatedUser.birthdate).toISOString() };
    expect(response.body.user).toMatchObject(expectedUser);
  });

  it('should respond with a 400 status code when missing required fields on PUT /users/:id', async () => {
    const incompleteUser = {
      firstName: 'Jane'
      // Missing lastName and birthdate
    };

    const response = await request(server)
      .put(`/users/${testUser.id}`)
      .send(incompleteUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('should respond with a 400 status code when user ID is invalid on PUT /users/:id', async () => {
    const invalidUserId = 'invalid'; // Un ID inválido
    const updatedUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      birthdate: '1985-01-01'
    };

    const response = await request(server)
      .put(`/users/${invalidUserId}`)
      .send(updatedUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  it('should respond with a 404 status code when user is not found on PUT /users/:id', async () => {
    const nonExistentUserId = 9999; // Asegúrate de que este ID no exista en tu base de datos
    const updatedUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      birthdate: '1985-01-01'
    };

    const response = await request(server)
      .put(`/users/${nonExistentUserId}`)
      .send(updatedUser);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should respond with a 200 status code and a message on DELETE /users/:id', async () => {
    const response = await request(server).delete(`/users/${testUser.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');

    // Verifica que el usuario ha sido eliminado
    const checkUser = await User.findByPk(testUser.id);
    expect(checkUser).toBeNull();
  });

  it('should respond with a 400 status code when user ID is invalid on DELETE /users/:id', async () => {
    const invalidUserId = 'invalid'; // Un ID inválido

    const response = await request(server).delete(`/users/${invalidUserId}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user ID');
  });

  it('should respond with a 404 status code when user is not found on DELETE /users/:id', async () => {
    const nonExistentUserId = 9999; // Asegúrate de que este ID no exista en tu base de datos

    const response = await request(server).delete(`/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should respond with a 404 status code when user is not found on GET /users/email/:email', async () => {
    const nonExistentEmail = 'non.existent@example.com';
    const response = await request(server).get(`/users/email/${nonExistentEmail}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should respond with a 400 status code when email is invalid on GET /users/email/:email', async () => {
    const invalidEmail = 'invalid-email';
    const response = await request(server).get(`/users/email/${invalidEmail}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email');
  });
});
