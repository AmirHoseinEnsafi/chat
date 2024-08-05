const router = require('express').Router()
const Message = require('../../model/Message')
const Room = require('../../model/Room')
const User = require('../../model/UserModel')
const auth = require('../../middlewere/checkJWT')
const {socketio : socket , socketioio : io} = require('../../socket/io')

router.put('/:room' , auth , async (req , res) => {
    const message = Message.findById(req.body.id)

    message.emoji.push({
        sender : {username : req.decoded.userName , id : req.decoded.id},
        emoji : req.body.emoji
    })

    await message.save()
    
    socket.emit('message' , message)

    if(req.params.room == 'room'){
        const room = await Room.findById(message.receiver.id)
        room.members.forEach(async (x) => {
            const user = await User.findById(x.id)
            if(user.online) io.on(user.socketIoId).emit('message' , message)
        })
    }else{
        const user = await User.findById(message.receiver.id)
        if (user.online) io.to(user.socketIoId).emit('message' , message)
    }
    res.status(200).send()
})

module.exports = router