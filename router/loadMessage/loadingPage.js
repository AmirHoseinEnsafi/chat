const router = require('express').Router()
const Message = require('../../model/Message')
const User = require('../../model/UserModel')
const auth = require('../../middlewere/checkJWT')

router.get('/' , auth , async (req , res) => {
    const user = await User.findById(req.decoded.id)

    const messages = []

    user.privateChat.forEach(async (x) => {
        const message = await Message.find({$or : [
            {sender : {userName : user.userName} , receiver : {userName : x.userName}} ,
            {sender : {userName : x.userName} , receiver : {userName : user.userName}}
            ]
        }).limit(20)

        messages.push(message)
    })

    user.roomName.forEach(async (x) => {
        const message = await Message.find({receiver : {userName : x.roomName}}).limit(20)
        messages.push(message)
    })
    res.json(messages)
})

module.exports = router