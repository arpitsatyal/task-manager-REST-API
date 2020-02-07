const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//virtual used for stuff that live on different schemas. it wont be stored in the db. only used by mongoose to see the relationship between the two.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//using toJSON we can restrict what we can return from an object.
userSchema.methods.toJSON = function () {
    const user = this
    // toObject converts the db object to raw object without stuff added by mongoose like versions.
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.avatar
    // delete userObject.tokens
    return userObject
}

//methods are accessible to the instances. so this referes to instance 'user'.
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    return token
}

// statics are accessible to the models. 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Hash the plain text password before saving
//following is a mongoose middleware. it will be fired before the save function is called by any of the endpoints.
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//delete user tasks when user is deleted
userSchema.pre('remove', async function (next) {
    let user = this
    await Task.deleteMany({ owner: user._id })
})

const User = mongoose.model('User', userSchema)

module.exports = User