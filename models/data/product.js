var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    pid: {type: Number},
    productType : {type: String},
    productName : {type: String},
    originPrice : {type: Number},
    img: {type: Buffer, contentType: String}
})

productSchema.static.findProductByType = (type, callback) => {
    this.find({"productType": type})
}

var Product = mongoose.model("Product", productSchema);


module.exports = Product;