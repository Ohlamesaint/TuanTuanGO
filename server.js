const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var cors = require("cors");
var app = express();
// var db = require("./model/db.js");
//var axios = require("axios")

const dbsetting = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const corsOption = {
    origin:[
        "https://luffy.ee.ncku.edu.tw"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With', 'Range']
}

app.use(cors(corsOption));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// db.use(cors(corsOption));

const Response = function(){
    this.accountValid = "";
    this.passwordValid = "";
    this.user = "";
}

app.get("/", (req, res, next)=>{
    res.send("Hello World");
});


app.get("/signin", (req, res, next)=>{
    console.log(req);
    var accountCheck = new Account({
        username: "Leo",
        password: "0512"
    })
    accountCheck.save();
    let response = new Response();
    res.send(response);
});

app.post("/signin", (req, res, next)=>{
    let data = req.body;
    let response = new Response();
    UserProfile.checkAccount(data, response, (result)=>{
        response = result;
        console.log(result);
        res.send(response);
    })
})

app.post("/signup", (req, res, next)=>{
    let data = req.body;
    console.log(data);
    var accountCheck = new UserProfile({
        username: "",
        password: ""
    })
    accountCheck.username = data.username;
    accountCheck.password = data.password;
    accountCheck.save();
    let response = new Response();
    res.send(response);
})

var PORT = process.env.PORT||5000;
app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));

mongoose.connect(process.env.MONGODB_URI, dbsetting, (error)=>{
    if(error){
        console.log(error);
        return
    }
    console.log(`Connect to ${process.env.MONGODB_URI}`)
});


var UserProfileSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
})

UserProfileSchema.statics.checkAccount = function(AccountInput, response, callback){
    this.find({"username": AccountInput.username}, function(err, docs){
        if(err){
            console.log("not found " + AccountInput.username);
            return;
        } 
        else{
            if(docs.length > 0){
                response.accountValid = true;
                console.log(docs[0]);
                if(docs[0].password == AccountInput.password){
                    response.passwordValid = true;
                    response.user = docs[0].user;
                    console.log(response + " in");
                }
                else{
                    response.passwordValid = false;
                }
            }
            else{
                response.accountValid = false;
            }
        }
        callback(response);
    })
}

var UserProfile = mongoose.model("UserProfile", UserProfileSchema)
