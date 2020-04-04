var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    // "uid": { type: Number },
    "username": { type: String },
    "password": {type: String},
    "user": {type: String}
    // "headPaste": {type: Buffer, contentType: String}
})


var UserProfile = mongoose.model("UserProfile", userSchema);

module.exports = UserProfile;