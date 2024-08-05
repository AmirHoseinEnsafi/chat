const router = require('express').Router()
const Message = require('../../model/Message')
const User = require('../../model/UserModel')
const Room = require('../../model/Room')
const auth = require('../../middlewere/checkJWT')
const {socketio : socket , socketioio : io} = require('../../socket/io')

router.post('/' , auth , async (req , res) => {
    const sender = await User.findById(req.decoded.id)
    const room = await Room.find({roomName : req.body.roomName})

    if(!room) return res.status(404).send(`room is not exist please send message to the right room name`)

    const userIsInRoom = room.members.filter((x) => x.userName === sender.userName)
    if(!userIsInRoom) return res.status(400).send(`please first join the room and after that send the message`)

    const userHaveRoomName = sender.roomName.filter((x) => x.roomName === room.roomName)
    if(!userHaveRoomName) sender.roomName.push({roomName : room.roomName , id : room._id}) , await sender.save()

    const message = await Message.create({
        sender : { userName : sender.userName , id : sender._id} , 
        receiver : {userName : room.roomName , id : room._id} , 
        message : req.body.message
    })

    socket.emit('message' , req.body.message)

    room.members.forEach(async (x) => {
        
        let useronline = await User.find({$and : [{userName : x.userName} , {online : true}]})
        if(!useronline) return
        io.to(useronline.socketIoId).emit('message' , req.body.message)
    })
})

module.exports = router