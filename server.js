const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var router = express.Router();
// var bodyParser = require("body-parser");
var app = express();

// let users = [
//     {

//     }
// ]


const Response = function(){
    this.success = false;
    this.result = {};
    this.message = "123";
}

router.get("/", (req, res, next)=>{

    res.send("Hello World");
});


router.get("/signin", (req, res, next)=>{
    let response = new Response();
    res.send(response);
});






var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"        //database url

MongoClient.connect(url_db, (err, client) => {
    if(err){
        return console.log("Could not connect to MongoDB Server\n", err.Message);
    }
    console.log("Connected to database...");
    db = client.db("heroku_l0nf7fg6");
});

var PORT = process.env.PORT||5000;
// app.use(express.static(__dirname + "/Outlook"));
app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));