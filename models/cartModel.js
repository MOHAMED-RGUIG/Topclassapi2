const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    userid: { type: String, required: true },
    productnameproduct: { type: String, required: true },
    product_id: { type: String, required: true },
    productimage: { type: String, required: true },
    productvarient: { type: String, required: true },
    quantity: { type: Number, required: true },
   
    prices: { type: Number, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('carts', cartSchema);
