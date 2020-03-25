const MongoClient = require("mongodb").MongoClient;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"

MongoClient.connect(url_db, (err, client) => {
    if(err){
        return console.log("Could not connect to MongoDB Server\n", err.Message);
    }
    console.log("Connected to database...");
    db = client.db("heroku_l0nf7fg6");
});

var PORT = process.env.PORT||5000;

// app.use(express.static(__dirname + "/Outlook"));

app.get("/", (req, res)=>{
    res.send("Hello World");
});

app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));

