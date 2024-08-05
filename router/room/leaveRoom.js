const router = require('express').Router()
const User = require('../../model/UserModel')
const Room = require('../../model/Room')
const auth = require('../../middlewere/checkJWT')

router.put('/:roomName' , auth , async (req , res) => {
    const user = await User.findById(req.decoded.id)
    const room = await Room.find(req.params.roomName)

    if(!room) return res.status(404).send(`room is not exist`)
    
    const existUser = room.members.filter((x) => x.userName === req.decoded.userName)
    if(!existUser) return res.status(400).send(`you allready leave the room`)
    
    room.members = room.members.filter((x) => x.userName !== req.decoded.userName)
    user.roomName = user.roomName.filter((x) => x.roomName !== req.params.roomName)

    const haveAdmin = room.members.filter((x) => x.isAdmin === true)
    
    if(!haveAdmin) {
        await Room.findByIdAndDelete(room._id)
        await user.save()
        return
    }

    Promise.all([room.save() , user.save()])
        .then(() => res.send(`you leaved the room`))
        .catch((err) => res.send(err.message))
})

module.exports = router