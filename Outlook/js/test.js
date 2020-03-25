var mysql = require("mysql");

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123",
    database: "test"
});

con.connect(function(err){
    if(err) throw err;
    console.log("connect success");
});

// con.connect(function(err){
//     if(err) throw err;
//     console.log("connect end");
// })