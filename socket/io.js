const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const router = express.Router()
const auth = require('../middlewere/checkJWT')
const User = require('../model/UserModel')


let socketio ;
let userInfo ;
let socketioio ;

router.get('/' , auth , async (req , res) => {
    const user = await User.findById(req.decoded.id)
    userInfo = user
    res.send('this is the main page')
})

io.on('connection' , async (socket) => {
    socketio = socket
    socketioio = io
    userInfo.socketIoId = socket.id
    userInfo.online = true 
    await userInfo.save()
    
    socket.on('disconnect' , async () => {
        userInfo.socketIoId = ''
        userInfo.online = false 
        await userInfo.save()
    })
})

module.exports = {server , socketio , socketioio , router , app}