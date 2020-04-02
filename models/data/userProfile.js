var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    "uid": { type: Number },
    "name": { type: String },
    "password": {type: String},
})

var UserProfile = mongoose.model("UserProfile", userSchema);

module.exports = UserProfile;