const router = require('express').Router()
const Message = require('../../model/Message')
const Room = require('../../model/Room')
const User = require('../../model/UserModel')
const auth = require('../../middlewere/checkJWT')
const {socketio : socket , socketioio : io} = require('../../socket/io')

router.put('/:room' , auth , async (req , res) => {
    const message = Message.findById(req.body.id)
    if(!message) return res.status(404).send(`message with given id is not exist`)

    if(message.sender.userName !== req.decoded.userName) return res.status(400).send(`you can not rewrite the someone else message`)

    message.message = req.body.message
    await message.save()    

    socket.emit('message' , message.message)

    if(req.params.room == 'room'){
        const room = await Room.find({roomName : req.body.roomName})
        room.members.foreach(async (x) => {
            const userIsOnline = await User.find({$and : [{userName : x.userName} , {online : true}]})
            if(userIsOnline) io.to(userIsOnline.socketIoId).emit('message' , message.message)    
        })
    }else{
        const receiver = await User.find({userName : req.body.userName})
        if(receiver.online) io.to(receiver.socketIoId).emit('message' , message.message)
    }
})

module.exports = router