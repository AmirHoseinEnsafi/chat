const router = require('express').Router()
const Message = require('../../model/Message')
const User = require('../../model/UserModel')
const auth = require('../../middlewere/checkJWT')
const {socketio : socket , socketioio : io} = require('../../socket/io')

router.post('/' , auth , async (req , res) => {
    const sender = await User.findById(req.decoded.id)
    const receiver = await User.find({userName : req.body.userName})

    if(!receiver) return res.status(404).send(`user with given user name is not exist or leave the web`)
    
    const message = Message.create({
        sender : {userName : sender.userName , id : sender._id} ,
        receiver : {userName : receiver.userName , id : receiver._id} ,
        message : req.body.message
    })

    socket.emit('message' , req.body.message)
    if(receiver.online) io.to(receiver.socketIoId).emit('message' , req.body.message)

    const haveReceiver = sender.privateChat.filter((x) => x.userName == receiver.userName)
    if(!haveReceiver){
        sender.privateChat.push({userName : receiver.userName , id : receiver._id})
        receiver.privateChat.push({userName : sender.userName , id : sender._id})

        Promise.all([sender.save() , receiver.save()])
            .then(() => res.send(`new private feild are created`))
            .catch((err) => res.status(500).send(`we have problem for create the new private file`))
    }
})

module.exports = router