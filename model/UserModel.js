const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    userName : {
        type : String ,
        minlength : 3 ,
        maxlength : 20 , 
        required : true ,
        unique : true 
    },
    name : {
        type : String ,
        minlength : 3 ,
        maxlength : 20 ,
        required : true 
    },
    lastName : {
        type : String ,
        minlength : 3 ,
        maxlength : 20 ,
        required : true 
    },
    email : {
        type : String ,
        minlength : 10 ,
        maxlength : 40 ,
        unique : true ,
        required : true ,
        validate : {
            validator : (x) => /^\S+@\S+\.\S+$/.test(v) ,
            message : (x) => `${x.message} is not valid email`
        }
    },
    password : {
        type : String ,
        minlength : 8 ,
        maxlength : 256 ,
        required : true 
    } ,
    number : {
        type : String ,
        minlength : 11 ,
        maxlength : 14 ,
        required : true 
    } ,
    online : {
       type : Boolean ,
       default : false 
    } , 
    socketIoId : String ,
    roomName : [{
        roomName : String ,
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'room'
        }
    }] ,
    privateChat : [{
        userName : String ,
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'user'
        }
    }]
})

userSchema.methods.token = function(){
    return token = jwt.sign({
        id : this._id ,
        userName : this.userName ,
        } ,
        config.get('jwt'),
        {expiresIn : '1d'}   
    )
}

const User = mongoose.model('user' , userSchema)
module.exports = User