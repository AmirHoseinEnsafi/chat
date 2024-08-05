const router = require('express').Router()
const User = require('../../model/UserModel')
const Room = require('../../model/Room')
const auth = require('../../middlewere/checkJWT')

router.post('/' , auth , async(req , res) => {
    const roomExist = await Room.find({roomName : req.body.roomName})
    if(roomExist) return res.send(400).send(`room name is already registered`)
    
    const room = new Room({
        roomName : req.body.roomName
    })

    room.members.push({
        userName : req.decoded.userName ,
        id : req.decoded.id , 
        isAdmin : true , })
    
    await room.save()
})

module.exports = router