const Room = require('../model/Room')

async function isAdminRoom(req , res , next){
    const room = await Room.findOne({roomName : req.params.roomName})
    if(!room)return res.status(404).send(`room is not exist please insert the valid room name`)
    
    const user = room.members.filter((x) => x.userName == req.decoded.userName)
    if(!user)return res.status(401).send('you are not in the room please first join or create the room')
    if(!user.isAdmin)return res.status(403).send(`you are not admin`)
    
    next()    
}

module.exports = isAdminRoom