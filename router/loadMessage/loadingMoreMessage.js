const router = require('express').Router()
const Message = require('../../model/Message')
const auth = require('../../middlewere/checkJWT')

router.get('/:page/:username' , auth , async (req , res) => {
    let mainSkip = 20 ;
    const {page , username} = req.params

    mainSkip = mainSkip * page

    const messages = Message.find({$or : [
        {sender : {userName : req.decoded.userName} , receiver : {userName : username}} , 
        {sender : {userName : username} , receiver : {userName : req.decoded.userName}}
        ]
    }).skip(mainSkip).limit(20)

    res.json(messages)

})

module.exports = router