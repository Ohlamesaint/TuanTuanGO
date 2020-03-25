const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var router = express.Router();
var cors = require("cors");
// var bodyParser = require("body-parser");
var app = express();

// let users = [
//     {

//     }
// ]

const corsOption = {
    origin:[
        "https://luffy.ee.ncku.edu.tw"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With', 'Range']
}

app.use(cors(corsOption));

const Response = function(){
    this.success = false;
    this.result = {};
    this.message = "123";
}

app.get("/", (req, res, next)=>{

    res.send("Hello World");
});


app.get("/signin", (req, res, next)=>{
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