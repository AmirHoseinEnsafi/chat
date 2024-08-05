const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender : {
        userName : {
            type : String ,
            required : true  
        },
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'user' ,
            required : true
        }
    },
    receiver : {
        userName : {
            type : String ,
            required : true
        } ,
        id : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'user' ,
            required : true
        } 
    } ,
    message : {
        type : String ,
        required : true
    } ,
    emoji : [{
        sender : {
            userName : {
                type : String ,
                required : true
            } ,
            id : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : 'user' ,
                required : true
            }
        } ,
        emoji : String 
    }]
})

const Message = mongoose.model('message' , messageSchema)
module.exports = Message 