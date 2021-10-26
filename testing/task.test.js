let request = require('supertest')
let app = require('../src/app')
let Task = require('../src/models/task')
let { setUpDB, userOne, userTwo, taskOne } = require('./fixtures/db')

beforeEach(setUpDB)

test('should create task for user', async () => {
    let response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'hello test task'
    })
    .expect(201)
    let task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('should get task for user', async () => {
    let response = await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('should not be able to delete arko ko task', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    let thatTask = await Task.findOne({ _id: taskOne._id })
    expect(thatTask).not.toBeNull()
})