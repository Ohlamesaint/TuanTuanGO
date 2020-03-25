const http = require("http");
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");



const handlers = {};
const database = {};
let db;



database.create = (shang, callback) => {            //db function for post request
    // setTimeout(() => {
    //     callback(null, "Success");
    // }, 3000);
    db.collection("shang").insertOne(shang, (err, result) => {
        if(!err&&result){
            callback(null, result);
        }else {
            callback(err);              //it wont be err for less parameter
        }
    })
};
database.read = (shangId, callback) => {
    const id = new ObjectId(shangId);
    db.collection("shang").findOne({_id: id}, (err, result) => {
        if(!err&&result){
            callback(null, result);
        }else {
            callback(err);              //it wont be err for less parameter
        }
    })
};
database.update = (shangId, newshang, callback) => {

    const id = new ObjectId(shangId);
    db.collection("shang").findOneAndUpdate({_id: id}, newshang, { returnOriginal: false }, (err, result) => {
        if(!err&&result){
            callback(null, result);
        }else {
            callback(err);              //it wont be err for less parameter
        }
    })
};
database.delete = (shangId, callback) => {
    const id = new ObjectId(shangId);
    db.collection("shang").findOneAndDelete({ _id: id}, (err, result) => {
        if(!err&&result){
            callback(null, result);
        }else {
            callback(err);              //it wont be err for less parameter
        }
    })
};

handlers.shang = (parsedReq, res) => {
    const acceptedMethods = ["get", "post", "put", "delete"];
    if(acceptedMethods.includes(parsedReq.method)){
        handlers._shang[parsedReq.method](parsedReq, res);
    }
    else{
        res.writeHead(400);
        res.end("Not an accepted method...");
    }
}

handlers._shang = {}
handlers._shang.get = (parsedReq, res) => {
    // res.end("GET")
    const shangId = parsedReq.queryStringObject.id;
    database.read(shangId, (err, result) => {
        if(!err && result){
            res.end(JSON.stringify(result));     //let it only return thing I post and its id
        }
        else{
            res.end(err);
        }
    })
}
handlers._shang.post = (parsedReq, res) => {

    const shang = JSON.parse(parsedReq.body);

    database.create(shang, (err, result) => {
        if(!err && result){
            res.end(JSON.stringify(result.ops[0]));     //let it only return thing I post and its id
        }
        else{
            res.end(err);
        }
    })
}
handlers._shang.put = (parsedReq, res) => {
    // res.end("PUT")
    const shang = JSON.parse(parsedReq.body);
    const shangId = parsedReq.queryStringObject.id;
    
    database.update(shangId, shang, (err, result) => {
        if(!err && result){
            res.end(JSON.stringify(result.value));     //let it only return thing I post and its id
        }
        else{
            res.end(err);
        }
    })
}
handlers._shang.delete = (parsedReq, res) => {
    // res.end("DELETE")
    const shangId = parsedReq.queryStringObject.id;
    database.delete(shangId, (err, result) => {
        if(!err && result){
            res.end(JSON.stringify(result.value));     //let it only return thing I post and its id
        }
        else{
            res.end(err);
        }
    })
    
}

handlers.notFound = (parsedReq, res) => {
    res.writeHead(404);
    res.end("Route not Found");
}

const router = {
    "Shang": handlers.shang,
}

const server = http.createServer((req, res)=>{
    console.log(req);

    res.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile("Outlook/outlook.html", (error, data)=>{
        if(error){
            res.writeHead(404);
            res.write("ERROR: File not found");
        }else {
            res.write(data);
        }
        res.end();
    })
    
    const parsedReq = {};

    parsedReq.parsedUrl = url.parse(req.url, true);
    parsedReq.path = parsedReq.parsedUrl.pathname;
    parsedReq.trimmedPath = parsedReq.path.replace(/^\/+|\/+$/g, "");
    parsedReq.method = req.method.toLowerCase();
    parsedReq.headers = req.headers;
    parsedReq.queryStringObject = parsedReq.parsedUrl.query;

    let body = [];

    req.on("data", (chunk) => {
        body.push(chunk);
    });

    req.on("end", () => {
        body = Buffer.concat(body).toString();
        parsedReq.body = body;

        const routedHandler = typeof(router[parsedReq.trimmedPath]) !== "undefined" ? router[parsedReq.trimmedPath] : handlers.notFound;
        
        routedHandler(parsedReq, res);
    })

    // res.end(`
    //     Path: ${parsedReq.path}
    //     Trimmed Path: ${parsedReq.trimmedPath}
    //     Method: ${parsedReq.method}
    //     Headers: \n${JSON.stringify(parsedReq.headers, null, 2)}
    //     Query Object: \n${JSON.stringify(parsedReq.queryStringObject, null, 2)}ddg
    // `);
})

var url_db = process.env.MONGODB_URI || "mongodb://localhost:27017/"

MongoClient.connect(url_db, (err, client) => {
    if(err){
        return console.log("Could not connect to MongoDB Server\n", err.Message);
    }
    console.log("Connected to database...");
    db = client.db("heroku_l0nf7fg6");
});

var PORT = process.env.PORT||5000;

server.listen(PORT, ()=>console.log(`listening on ${PORT}...`));