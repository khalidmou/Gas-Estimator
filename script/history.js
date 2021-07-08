const mongoose=require('mongoose')
const schema= mongoose.Schema; 

const userHistorySchema= new schema({
    gallonsQuantity:Number,
    date:String,
    totalPrice:Number,
    pricePerGallon:Number,
})

const History = mongoose.model('History',userHistorySchema);
module.exports = History;

