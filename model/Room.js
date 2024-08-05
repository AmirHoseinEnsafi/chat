const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomName : {
        type : String ,
        minlength : 5 ,
        maxlength : 50 ,
        unique : true 
    } ,
    members : [{
        userName : String ,
        isAdmin : {
            type : Boolean ,
            default : false 
        } ,
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'user'
        }
    }]
})

const Room = mongoose.model('room' , roomSchema)
module.exports = Room