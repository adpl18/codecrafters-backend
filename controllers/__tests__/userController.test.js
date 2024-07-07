const request = require('supertest');
const app = require('../../app'); // Adjust the path as needed

let server;

beforeAll((done) => {
  server = app.listen(done); // Start the server before tests
});

afterAll((done) => {
  server.close(done); // Close the server after tests
});

describe('Koa App Endpoints', () => {
  it('should respond with a 200 status code on GET /', async () => {
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
  });
});
