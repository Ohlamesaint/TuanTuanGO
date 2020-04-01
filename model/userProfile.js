var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    "uid": { type: Number },
    "name": { type: String },
    "password": {type: String},
})

var User = mongoose.model("User", userSchema);

module.exports = User;