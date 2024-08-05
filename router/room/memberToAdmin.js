const router = require('express').Router()
const User = require('../../model/UserModel')
const Room = require('../../model/Room')
const auth = require('../../middlewere/checkJWT')
const isAdmin = require('../../middlewere/isAdmin')

router.put('/:roomName' , [auth , isAdmin] , async (req , res) => {
    const room = await Room.find({name : req.params.roomName})
    if(!room) return res.status(404).send(`room is not exist`)
    
    const userToAdmin = await User.find({$or : [{userName : req.body.userName} , {email : req.body.userName}]})
    if(!userToAdmin) return res.status(404).send(`user with givin fild name is not the find`)
    
    const member = room.members.filter((x) => x.userName === userToAdmin.userName)
    if(!member) return res.status(400).send(`first user must be join the room`)

    room.members = room.members.map((x) => {
                if(x.userName == userToAdmin) return {...x , isAdmin : true}
                return x
            })
    await room.save()
})

module.exports = router