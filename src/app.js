//for testing

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use((err, req, res, next) => {
    console.log('i am error handling middleware.', err)
    res.status(err.status || 400)
    res.json({
        message: err.message || err,
    })
})

module.exports = app