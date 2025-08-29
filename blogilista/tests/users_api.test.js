const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const User = require('../models/user')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

test('user must contain username and password', async () => {
    const response = await api.post('/api/users')
        .send({ password: 'Password' })
        .expect(400)
    assert.strictEqual(response.body.error, 'Missing username or password')
    const response2 = await api.post('/api/users')
        .send({ username: 'Username' })
        .expect(400)
    assert.strictEqual(response2.body.error, 'Missing username or password')
})

test('password must be at least 3 characters long', async () => {
    const response = await api.post('/api/users')
        .send({ username: 'Username', password: '12' })
        .expect(400)
    assert.strictEqual(response.body.error, 'Password must be min 3 characters long')
})

after(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
})