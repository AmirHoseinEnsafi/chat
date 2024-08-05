const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../../model/UserModel')

router.post('/' , async (req, res) => {
    if(req.body.userName.length < 3 ) return res.status(400).send(`please send the valid username or email`)
    
    const user = await User.find({$or : [{email : req.body.userName} , {userName : req.body.userName}]})
    if(!user) return res.send(`user fild or password is not correct`)
    
    const passcom = await bcrypt.compare(req.body.password , user.password)
    if(!passcom) return res.status(400).send(`user fild or password is not correct`)

    res.set('x-chat' , user.token()).send(`login was successfully`)
})

module.exports = router