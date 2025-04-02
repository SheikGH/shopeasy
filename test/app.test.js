const request = require('supertest');
const { app, server, name } = require('../app');

describe('GET /', () => {
    it('should return 200 status and correct message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Welcome to ShopEasy from ${name}!`);
    });
});

afterAll(() => {
    server.close();
});