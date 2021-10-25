const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('db connected'))
.catch(() => console.log('err in mongoose'))