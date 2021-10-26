let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')
let User = require('../../src/models/user')
let Task = require('../../src/models/task')

let userOneId = new mongoose.Types.ObjectId()

let userOne = {
    _id: userOneId,
    name: 'Arpit',
    email: 'arpited7@gmail.com',
    password: 'whatthefuck',
    tokens: [
        {
            token:
                jwt.sign({ _id: userOneId }, 'thisismynewcourse')
        }
    ]
}

let userTwoId = new mongoose.Types.ObjectId()

let userTwo = {
    _id: userTwoId,
    name: 'Andrew',
    email: 'andrew@gmail.com',
    password: 'whatthefuck',
    tokens: [
        {
            token:
                jwt.sign({ _id: userTwoId }, 'thisismynewcourse')
        }
    ]
}

let taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task one',
    completed: false,
    owner: userOneId
}

let taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task two',
    completed: true,
    owner: userOneId
}

let taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task three',
    completed: true,
    owner: userTwoId
}

let setUpDB = async () => {
    await User.deleteMany({})
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId, userOne, userTwo, userTwoId, setUpDB, taskOne
}