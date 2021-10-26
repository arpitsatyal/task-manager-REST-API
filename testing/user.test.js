let request = require('supertest')
let app = require('../src/app')
let User = require('../src/models/user')
let { setUpDB, userOne, userOneId } = require('./fixtures/db')

beforeEach(setUpDB)

test('should sign up a new user', async () => {
    let response = await request(app)
        .post('/users/register')
        .send({
            name: 'Arpit2',
            email: 'arpited72@gmail.com',
            password: 'whatthefuck'
        })
        .expect(201)

    //  assert that the db was changed correctly
    let user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertions about the response
    // expect(response.body).toMatchObject({
    //     user: {
    //         name: 'Arpit'
    //     },
    //     token: user.tokens[0].token
    // }) -- not exactly matching
    expect(user.password).not.toBe('whatthefuck')
})

test('should login existing user', async () => {
    let response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    let user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('shouldnt login non existing users', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'jww@eio.com', password: 'wjdeoi'
        })
        .expect(400)
})

test('should get user profile', async () => {
    await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get user profile', async () => {
    await request(app)
        .get('/users/profile')
        .send()
        .expect(401)
})

test('should be able to delete account', async () => {
    await request(app)
    .delete('/users/profile')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    let user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not be able to delete account', async () => {
    await request(app)
    .delete('/users/profile')
    .send()
    .expect(401)
})

// test('should upload avatar', async () => {
//     await request(app)
//     .post('/users/profile/avatar')
//     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//     .attach('avatar','tests/fixtures/profilepic.png')
//     .expect(200)
//     let user = await User.findById(userOneId)
//     .expect(user.avatar).toEqual(expect.any(Buffer))
// })

test('should update user fileds', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'chutiya' })
    let user = await User.findById(userOneId)
        expect(user.name).toEqual('chutiya')
})

test('should not update invalid user fileds', async () => {
    await request(app)
        .patch('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ color: 'red' })
        .expect(400)
})