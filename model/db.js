var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"        //database url

var mongoClient = require("mongodb").MongoClient;

function getAccount(callback){
    mongoClient.connect(url_db, function(err, database){
        if(err){
            console.log("error to connect with db")
            return;
        }
        console.log("connect success");
        const myDB = database.db("shang");
        myDB.collection("shang").find({}).toArray(function(err, arr){
            callback(arr);
            database.close();
        })
    })
}

exports.getAccount = getAccount;

// getAccount(function(arr){
//     console.log(arr);
// })