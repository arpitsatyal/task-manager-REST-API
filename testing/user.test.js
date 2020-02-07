const request = require('supertest')
const app = require('../src/app')

test('Should signup a new user',  async () => {
    request(app).post('/users').send({
        name: 'bob',
        email: 'arpot@example.com',
        password: 'MyPass777!'
    }).expect(201)
})