const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var cors = require("cors");
var app = express();
var product = require("./models/data/product");
const formidable = require('formidable');
var fs = require("fs");
var session = require("express-session");

const corsOption = {
    origin:[
        "https://luffy.ee.ncku.edu.tw"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With', 'Range']
}

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

app.use(session({ 
    name: "sessid",
    resave: false,
    secret: 'firstTime', 
    cookie: { maxAge: 2*60*1000*60}, 
    saveUninitialized: false,
    resave: false
}))

app.use(cors(corsOption));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const Response = function(){
    this.accountValid = "";
    this.passwordValid = "";
    this.user = "";
}

app.get("/signin", (req, res, next)=>{
    if(!req.session.signin){
        console.log("fail");
        res.send({signin: false});
        console.log(req.session);
        return;
    }else{
        res.send({signin: true});
        console.log(req.session);
        // UserProfile.checkAccount(req.session.username, (result)=>{
        //     console.log("success");
            
        return;
        // })
    }
});


app.post("/signin", (req, res, next)=>{
    let data = req.body;
    let response = new Response();
    UserProfile.checkAccount(data.username, (result)=>{
        // console.log(result, typeof(result));
        if(result){
            response.accountValid = true;
            if(data.password === result.password){
                response.passwordValid = true;
                response.user = result.user;
                //if(!req.session.username){
                req.session.signin = true;
                req.session.username = result.user;
                console.log("session = "+ req.session.username);
                //}
            }
            else{
                response.passwordValid = false;
            }
        }
        else{
            response.passwordValid = false;
            response.accountValid = false;
        }
        res.send(response);
        console.log(req.session);
    })
})

// app.post("/signup", (req, res, next)=>{
//     let data = req.body;
//     console.log(data);
//     var accountCheck = new UserProfile({
//         username: "",
//         password: ""
//     })
//     accountCheck.username = data.username;
//     accountCheck.password = data.password;
//     accountCheck.save();
//     let response = new Response();
//     res.send(response);
// })


//server connection
var PORT = process.env.PORT;
app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));


//db connection
mongoose.connect(process.env.MONGODB_URI, dbsetting, (error)=>{
    if(error){
        console.log(error);
        return
    }
    console.log(`Connect to ${process.env.MONGODB_URI}`)
});


var UserProfileSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    user: {type: String, required: true}
})

UserProfileSchema.statics.checkAccount = function(username, callback){
    this.find({"username": username}, function(err, docs){
        if(err){
            console.log("not found " + username);
            return;
        } 
        else{
            callback(docs[0]);
        }
    })
}

var UserProfile = mongoose.model("UserProfile", UserProfileSchema)

// var imageUrl = "./img/LaoXieZhenFrozenPorkRiceBurger";

// var test = new Product({
//     pid: 10001,
//     productType : test,
//     productName : testProduct,
//     originPrice : 500,
// })

// test.img.data = fs.readFileSync(imageUrl);
// test.img.contentType = "image/svg";