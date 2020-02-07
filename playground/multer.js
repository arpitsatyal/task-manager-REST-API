let multer = require('multer')
let upload = multer( {
    dest: 'images'
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})

let upload = multer({
    dest: 'avatar',
    limits: {
        fileSize: 100000,
    }, fileFilter: function (req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('file must be valid type.'))
        } 
        cb(null, true)
    }
})