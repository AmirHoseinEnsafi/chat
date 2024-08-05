const config = require('config')
const jwt = require('jsonwebtoken')

function auth(req , res , next){
    const token = req.header['x-chat']
    if(!token) return res.status(401).send(`unauthorize`)
    
    try {
        const decoded = jwt.verify(token , config.get('jwt'))
        req.decoded = decoded
    } catch (error) {
        res.send(`${error.message}`)
    }   
    next() 
}
module.exports = auth
