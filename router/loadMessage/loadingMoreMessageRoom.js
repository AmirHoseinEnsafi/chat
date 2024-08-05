const router = require('express').Router()
const Message = require('../../model/Message')
const auth = require('../../middlewere/checkJWT')

router.get('/:page/:roomname' , auth , async (req , res) => {
    let mainSkip = 20 ;
    const {page , roomname} = req.params

    mainSkip = mainSkip * page

    const messages = Message.find({
        receiver : {userName : roomname}
    }).skip(mainSkip)
      .limit(20)

    res.json(messages)

})

module.exports = router