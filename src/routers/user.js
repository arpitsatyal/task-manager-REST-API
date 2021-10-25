const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
// const sharp = require('sharp')
const { sendWeclomeMail, sendByeByeMail } = require('../emails/account')
const router = new express.Router()

router.post('/users/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // sendWeclomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        console.log('ERROR IN SIGNUP', err)
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send('invalid password.')
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/profile', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.get('/users', async (req, res) => {
    try {
        let user = await User.find({})
        res.send(user)
    } catch (e) {
        res.status(500).send('cannot find users.')
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/profile', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        sendByeByeMail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

let upload = multer({
    limits: {
        fileSize: 1000000,
    }, fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            return cb(new Error('photo must be valid type.'))
        }
        cb(null, true)
    }
})

// router.post('/users/profile/avatar', auth, upload.single('upload'), async (req, res) => {
//     try {
//         const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//         req.user.avatar = buffer
//         await req.user.save()
//         res.send()
//     } catch (e) {
//         next({ message: err.message })
//     }
// })

router.get('/users/:id/avatar', auth,  async (req, res) => {
    try {
        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.delete('/users/profile/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null
        await req.user.save()
        res.status(200).send('photo deleted.')
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router