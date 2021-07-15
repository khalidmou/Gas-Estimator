const mongoose = require('mongoose');
const History = require('./history')
const passportLocalMongoose = require('passport-local-mongoose');
const schema= mongoose.Schema; 

const userDataSchema=new schema({
  
    fullname:{
        type:String,
        
    },

    secretkey:{
        type : String,
    },

    address1:{
        type:String,
    },
    address2:{
        type:String,
    },
    state:{
        type:String,
    },
    zipcode:{
        type:Number,
    },
    histories:[{type:schema.Types.ObjectId,ref:"History"}]
})

userDataSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userDataSchema)
module.exports=User;


