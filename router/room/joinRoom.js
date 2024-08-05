const router = require('express').Router()
const User = require('../../model/UserModel')
const Room = require('../../model/Room')
const auth = require('../../middlewere/checkJWT')

router.put('/' , auth , async (req , res) => {
    const room = await Room.find({roomName : req.body.roomName})
    if(!room) return res.status(404).send(`room is not exist please send the exist room name or create this room`)
    
    const user = await User.findById(req.decoded.id)

    const userHaveRoom = user.roomName.filter((x) => x.roomName == room.roomName)
    if(userHaveRoom) return res.status(400).send(`you already joined in this room`)
    
    user.roomName.push({roomName : room.roomName , id : room._id})
    room.members.push({userName : user.userName , id : user._id})

    Promise.all([user.save() , room.save()])
        .then(() => res.send(`you joined the room`))
        .catch((err) => res.send(err.message))
})

module.exports = router