const request = require('supertest');
const app = require('../app');

describe('Testing the entire app', () => {
  it('should return a 200 status code for the home route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
