const app = require('./app')
const port = 4200

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
