var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"        //database url

var mongoClient = require("mongodb").MongoClient;

function getAccount(callback){
    mongoClient.connect(url_db, function(err, db){
        if(err){
            console.log("error to connect with db")
            return;
        }
        console.log("connect success");

        db.collection("shang").find({}).toArray(function(err, arr){
            callback(arr);
            db.close();
        })
    })
}

exports.getAccount = getAccount;

getStudent(function(arr){
    console.log(arr);
})