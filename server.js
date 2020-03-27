
var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var cors = require("cors");
var app = express();
// var db = require("./model/db.js");
//var axios = require("axios")

const options = {
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

mongoose.connect = (process.env.MONGODB_URI+"/UserProfile", options, function(error){
    if(error){
        console.log("database connections error");
        return;
    }
    console.log("connect to database");
});
// console.log(process.env.MONGODB_URI);

var Account = mongoose.model("UserProfile", {
    username: String,
    password: String,
})

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
    this.success = false;
    this.result = {};
    this.accountValid = "無此會員帳號!";
    this.passwordValid = "密碼錯誤!";
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
    var accountCheck = new Account({
        username: "Leo",
        password: "0512"
    })
    accountCheck.save();
    let response = new Response();
    res.send(response);
})
// function accountCheck(json, callback){
//     var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"        //database url

//     MongoClient.connect(url_db, (err, client) => {
//     if(err){
//         return console.log("Could not connect to MongoDB Server\n", err.Message);
//     }
//         console.log("Connected to database...");
//         db = client.db("heroku_l0nf7fg6");
//         db.collection.insertOne(json, function(err, r){
//             if(err){
//                 console.log("error");
//                 callback("-1");
//                 return
//             }
//         })
//         // db.collection("shang").find({}).toArray(function(err, arr){
//         //     callback(arr);
//         //     db.close();
//         // })
//     });
// }

// module.exports = accountCheck;



var PORT = process.env.PORT||5000;
// app.use(express.static(__dirname + "/Outlook"));
app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));