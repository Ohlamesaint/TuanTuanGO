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
    credentials: true,
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
    resave: false,
    secure: false
}))

app.use(cors(corsOption));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const Response = function(){
    this.accountValid = "";
    this.passwordValid = "";
    this.user = "";
}

app.get("/signin", (req, res, next)=>{      //確認是否有登入
    // res.setHeader('Access-Control-Allow-Origin',"https://luffy.ee.ncku.edu.tw");
    if(!req.session.signin){
        console.log("fail");
        res.send({signin: false});
        console.log(req.session);
        return;
    }else{
        console.log(req.session);
        // UserProfile.checkAccount(req.session.username, (result)=>{
        //     console.log(result);
        //     var headPasteBuf = (result.headPaste.buffer).toString('utf8');
        res.send({signin: true});
        return;             //這裡之後要改成next();
        // })
    }
});

app.get('/profile', function(req, res, next){
    if(!req.session.signin){
        console.log("fail");
        res.send({"signin": false});
        console.log(req.session);
        return;
    }else{
        UserProfile.checkAccount(req.session.username, (result)=>{
            console.log(result);
            // var headPasteBuf = (result.headPaste.buffer).toString('utf8');
            res.send({"signin": true, "user": result.user, "username": result.username, "headPaste": result.headPaste.Buffer});
            return;             //這裡之後要改成next();
        })
    }
})

app.get('/signOut', function(req, res, next){
    // 備註：這裡用的 session-file-store 在destroy 方法裡，並沒有銷燬cookie
    // 所以客戶端的 cookie 還是存在，導致的問題 --> 退出登陸後，服務端檢測到cookie
    // 然後去查詢對應的 session 檔案，報錯
    // session-file-store 本身的bug  
    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登入失敗'});
            return;
        }
        // req.session.loginUser = null;
        res.clearCookie("sessid");
        res.send("登出成功!");
    });
});


app.post("/signin", (req, res, next)=>{
    let data = req.body;
    let response = new Response();
    UserProfile.checkAccount(data.username, (result)=>{
        // console.log(result, typeof(result));
        // console.log(result);
        console.log(result.headPaste);
        // console.log((result.headPaste.buffer).toString('utf8'));
        // console.log(result.headPaste.contentType);
        // console.log(result.headPaste.Buffer);
        // console.log((result.headPaste.Buffer.buffer).toString('utf8'));
        if(result){
            response.accountValid = true;
            if(data.password === result.password){
                response.passwordValid = true;
                response.user = result.user;
                //if(!req.session.username){
                req.session.signin = true;
                req.session.user = result.user;     //於session中儲存使用者姓名
                req.session.username = result.username  //於session中儲存使用者帳號名稱
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
        // res.setHeader('Access-Control-Allow-Origin',"https://luffy.ee.ncku.edu.tw");
        res.send(response);
        console.log(req.session);
    })
})

app.post("/registration", (req, res, next)=>{
    const form = new formidable.IncomingForm();
    console.log(form);
    form.parse(req, (err, field, files)=>{
        if(err){
            throw new err;
        }
        UserProfile.checkAccount(field.username, result=>{      //查詢帳號是否已被使用
            if(result){
                console.log("occupied: "+ result);
                res.send({occupied: true});             //此帳號已被使用
                return;
            }
            else {
                var accountGenerate = new UserProfile({
                    username: "",
                    password: "",
                    user: "",
                    headPaste: "",
                })
                accountGenerate.username = field.username;
                accountGenerate.password = field.password;
                accountGenerate.user = field.user;
                console.log(files.headPaste);
                console.log(files.headPaste.path);
                accountGenerate.headPaste.data = fs.readFileSync(files.headPaste.path);
                accountGenerate.headPaste.contentType = files.headPaste.type;
                accountGenerate.save();
                // console.log("fields: " + fieldJSON);
                // console.log("files: " + filesJSON);
                // res.send({"fields": fieldJSON, "files": filesJSON});
                res.send({occupied: false});
            }
        })
    })
})


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
    user: {type: String, required: true},
    headPaste: {type: Buffer, contentType: String}      //必須先將圖片檔轉成Binary data
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