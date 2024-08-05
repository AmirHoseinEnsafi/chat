const router = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('config')

const User = require('../../model/UserModel')
const validator = require('../../joiValidator/signUp')

router.post('/' , async(req , res) => {
    const {error} = validator.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const userExist = await User.find({$or : [{email : req.body.email} , {userName : req.body.userName}]})
    if(userExist) return res.status(400).send(`username or email is already registered`)
    
    const gensalt = await bcrypt.genSalt(10)
    req.body.password = bcrypt.hash(req.body.password , gensalt)

    const user = User.create(req.body)
    res.set('x-chat' , user.token()).status(201).send(`user created successfully`)
})

module.exports = router