const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name:{type:String,require},
    email:{type:String,require},
    userid:{type:String,require},
    orderItems : [],
    orderAmount:{type:Number,require},
    codeClient:{type:String,require},
    raisonSocial:{type:String,require},
    adresse:{type:String,require},
    tel:{type:String,require},
    emailClt:{type:String,require},
    comment:{type:String,require},
    isDelivered:{type:Boolean,default:false},

},{
    timestamps : true,
})
module.exports = mongoose.model('orders',orderSchema)
