const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var cors = require("cors");
var app = express();
const formidable = require('formidable');
var fs = require("fs");
var session = require("express-session");
var create= require("./blockchain/create");


const corsOption = {
    origin:[
        "https://luffy.ee.ncku.edu.tw",
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
            console.log(result.headPaste);
            //var headPasteBuf = JSON.parse(Buffer.from(result.headPaste, 'binary'));  大頭貼問題
            // console.log(headPasteBuf);
            // var headPasteJSON = JSON.stringify(headPasteBuf);
            // fs.readFileSync(result.headPaste, 'utf8', (err, data)=>{
            //     if(err){
            //         res.send(err);
            //         return
            //     }else{
            //         console.log(data);
            res.send({"signin": true, "user": result.user, "username": result.username, "headPaste": result.headPaste});
            return; 
            // }
            // })
            // res.send({"signin": true, "user": result.user, "username": result.username, "headPaste": result.headPaste.buffer});
            // console.log(headPasteJSON);
            //這裡之後要改成next();
        })
    }
})

app.get('/signOut', function(req, res, next){
    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登入失敗'});
            return;
        }
        res.clearCookie("sessid");
        res.send("登出成功!");
    });
});


app.post("/signin", (req, res, next)=>{
    let data = req.body;
    let response = new Response();
    UserProfile.checkAccount(data.username, (result)=>{
        if(result){
            response.accountValid = true;
            if(data.password === result.password){
                response.passwordValid = true;
                response.user = result.user;
                req.session.signin = true;
                req.session.user = result.user;     //於session中儲存使用者姓名
                req.session.username = result.username  //於session中儲存使用者帳號名稱
                console.log("session = "+ req.session.username);
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
    })
})


app.get("/products/:check", (req, res, next)=>{
    if(/[\d]{6}/.test(req.params.check)){
        let productID = req.params.check;
        Product.findProductByID(productID, (result)=>{
            console.log(result);
            res.send(result);
        })
    }else{
        res.send('error! not such ID')
    }
})

function joinTuanGOFunc(username, TuanGOAddress){
    UserProfile.checkAccount(username, (res)=>{
        if(res){
            res.joinTuanGOAddress.push(TuanGOAddress);
        }else{
            throw new Error("cannot not join");
        }
    })

    TuanGO.findTuanGOByAddress(TuanGOAddress, (res)=>{
        if(res){
            res.members.push(username);
        }else{
            throw new Error("cannot find tuanGO");
        }
    })
}

app.post("/join", (req, res, next)=>{
    let data = req.body;
    let dataJSON = JSON.stringify(data);
    console.log("join: " + dataJSON);
    UserProfile.checkAccount(req.session.username, (resAccount)=>{
        if(resAccount){
            create.join(data.contractAddress, resAccount.walletPrivateKey, data.amount).then((result)=>{
                joinTuanGOFunc(req.session.username, data.contractAddress);
                console.log(result);
                res.send(result);
            }).catch((err=>{
                res.send(err);
                throw new Error(err);
            }))
        }else{
            throw new Error("can't find Account");
        }
    })
})

app.post("/deploy", (req, res, next)=>{
    let data = req.body;
    console.log(data);
    var date = Date.UTC(data.ExpirationTime.slice(2,4), data.ExpirationTime.slice(5,7), data.ExpirationTime.slice(8,10), data.ExpirationTime.slice(11,13), data.ExpirationTime.slice(14,16), 0, 0);
    var date2 = Date.UTC(data.setUpTime.slice(2,4), data.setUpTime.slice(5,7), data.setUpTime.slice(8,10), data.setUpTime.slice(11,13), data.setUpTime.slice(14,16), 0, 0);
    let durationInMin = (Math.floor(Math.abs(date - date2)/60000));
    var TuanGOGenerate = new TuanGO({
        TuanGOAddress : "",
        productID : data.productID,
        productType : "",
        TuanGOtype : data.type,
        price: 0,
        setUpTime: data.setUpTime,
        ExpirationTime : data.ExpirationTime,
        duration: durationInMin,
        members: [],
    });
    Product.findProductByID(data.productID, (productRes)=>{
        if(productRes){
            TuanGOGenerate.price = productRes.price;
            TuanGOGenerate.productType = productRes.productType;
            if(data.type === 1){
                create.deploy_unpack(productRes.unpackableAmount, Math.floor(productRes.price), TuanGOGenerate.duration).then((result)=>{
                    TuanGOGenerate.price = productRes.price;
                    TuanGOGenerate.TuanGOAddress = result;
                    console.log(JSON.stringify(TuanGOGenerate));
                    TuanGOGenerate.save();
                    res.send({"contractAddress": result});
                });
            }else if(data.type === 0){
                create.deploy(productRes.PromotionlowestNum, productRes.price, Math.floor(productRes.PromotionPrice), TuanGOGenerate.duration).then((result)=>{
                    TuanGOGenerate.TuanGOAddress = result;
                    TuanGOGenerate.price = productRes.PromotionPrice;
                    console.log(JSON.stringify(TuanGOGenerate));
                    TuanGOGenerate.save();
                    res.send({"contractAddress": result});
                });
            }else{
                throw new Error("error TuanGO type");
            }
        }else{
            throw new Error("product not found");
        }
    });
})

const mainPageResponse = function(){
    this.productName = "";
    this.originalPrice = 0;
    this.ExpirationTime = "";
    this.disccountPrice = 0;
    this.TuanGOType = 0;
    this.TuanGOAddress = "";
    this.TuanGOmembers = [];
}

app.post('/mainPageProducts', (req, res, next)=>{
    let data = req.body;
    let response = new mainPageResponse();
    TuanGO.findTuanGOByProductType(data.productType, (result)=>{
        if(result){
            response.ExpirationTime = result.ExpirationTime;
            response.TuanGOType = result.TuanGOtype;
            response.TuanGOmembers = result.members;
            response.TuanGOAddress = result.TuanGOAddress;
            console.log(result.members);
            Product.findProductByID(result.productID, (ProductInform)=>{
                if(ProductInform){
                    response.productName = ProductInform.productName;
                    response.originalPrice = ProductInform.price;
                    response.disccountPrice = response.TuanGOType?ProductInform.price:ProductInform.PromotionPrice
                    console.log(response);
                    res.send(response);
                } else{
                    res.error('not found productID');
                }
            })
        } else{
            console.log("not found " + data.productType);
            res.send(response);
        }
    })
})



//server connection
var PORT = process.env.PORT;
console.log(process.env);
console.log(__dirname + '/public');
app.listen(PORT, ()=>console.log(`listening on ${PORT}...`));


//db connection
mongoose.connect(process.env.MONGODB_URI, dbsetting, (error)=>{
    if(error){
        console.log(error);
        return
    }
    console.log(`Connect to ${process.env.MONGODB_URI}`)
});
/*****************tuanGO collection******************/

var TuanGOSchema = new mongoose.Schema({
    TuanGOAddress : {type: String, required: true},
    productID : {type: Number, required: true},
    productType: {type: String, required: true},
    TuanGOtype : {type: Number, required: true},
    setUpTime : {type: Date, default: Date.now, required: true},
    price: {type: Number, required: true},
    duration: {type: Number, required: true},
    ExpirationTime : {type: Date, required: true},
    members: [String],              //會員username
})

TuanGOSchema.statics.findTuanGOByAddress = function(TuanGOAddress, callback){
    this.find({"TuanGOAddress": TuanGOAddress}, function(err, docs){
        if(err){
            console.log("not found " + TuanGOAddress);
            return;
        } 
        else{
            callback(docs[0]);
        }
    })
}

TuanGOSchema.statics.findTuanGOByProductType = function(productType, callback){
    this.find({"productType": productType}, function(err, docs){
        if(err){
            console.log("not found " + productType);
            return;
        } 
        else{
            callback(docs[0]);
        }
    })
}

var TuanGO = mongoose.model("TuanGO", TuanGOSchema)
/***************userProfile collection***************/

var UserProfileSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    user: {type: String, required: true},
    region: {type: String, required: true},
    address: {type: String, required: true},
    headPaste: {type: Buffer, contentType: String},      //必須先將圖片檔轉成Binary data
    walletAddress: {type: String, required: true},
    walletPrivateKey: {type: String, required:true},
    joinTuanGOAddress: [String],
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

/*****************products collection*****************/

var productsSchema = new mongoose.Schema({
    productName: {type: String, required: true},
    productType: {type:String, required: true},
    productID: {type: Number, required: true},
    price: {type: Number, required: true},
    unpackable: {type: Boolean, required: true},        //是否可拆分團購
    unpackableAmount: {type: Number},                    //可拆分的數量，在可拆分的前提下
    hasPromotion: {type: Boolean, required: true},
    PromotionlowestNum: {type: Number},
    PromotionPrice: {type: Number},
    productPhoto: {type: Buffer, contentType: String},
})

productsSchema.statics.findProductByID = function(ID, callback){
    this.find({"productID": ID}, function(err, docs){
        if(err){
            console.log("not found " + ID);
            return;
        }
        else{
            callback(docs[0]);
        }
    })
}

productsSchema.statics.findProductByName = function(productName, callback){
    this.find({"productName": productName}, function(err, docs){
        if(err){
            console.log("not found " + productName);
            return;
        }
        else{
            callback(docs[0]);
        }
    })
}

var Product = mongoose.model("Product", productsSchema);


/**********************註冊路由**************************/

app.post("/registration", (req, res, next)=>{
    // console.log('req: ', req);
    // console.log('req.data.username: ' + req.data.username);
    const form = new formidable.IncomingForm();
    console.log(form);
    // form.uploadDir = "./public";
    form.parse(req, (err, field, files)=>{
        if(err){
            throw new Error();
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
                    region: "",
                    address: "",
                    headPaste: "",
                    walletAddress: "",
                    walletPrivateKey: "",
                })
                accountGenerate.username = field.username;
                accountGenerate.password = field.password;
                accountGenerate.user = field.user;
                accountGenerate.region = field.region;
                accountGenerate.address = field.address;
                create.create(String(field.password)).then((res)=>{
                    console.log(res);
                    accountGenerate.walletAddress = `0x${res.address}`;
                    accountGenerate.walletPrivateKey = res.privatekey;
                    return(accountGenerate);
                }).then((res)=>{
                    console.log(JSON.stringify(res));
                    accountGenerate.save();
                }).catch((err)=>{
                    throw new Error(err);
                })
                res.send({occupied: false});
            }
        })
    })
})

app.post("/addProduct", (req, res, next)=>{
    const form = new formidable.IncomingForm();
    console.log(form);
    form.parse(req, (err, fields, files)=>{
        if(err){
            throw new Error(err);
        }else {
            Product.findProductByID(fields.ID, (result)=>{
                if(result){
                    console.log("ID occupied: "+result);
                    res.send({occupied: true})
                }else{
                    var productGenerate = new Product({
                        productName: "",
                        productType: "",
                        productID: "",
                        price: 0,
                        unpackable: false,                      //是否可拆分團購
                        unpackableAmount: 0,                    //可拆分的數量，在可拆分的前提下
                        hasPromotion: false,
                        PromotionlowestNum: 0,
                        PromotionPrice: 0,
                        productPhoto: "",
                    })
                    productGenerate.productName = fields.productName;
                    productGenerate.productType = fields.productType;
                    productGenerate.productID = fields.ID;
                    productGenerate.price = fields.price;
                    productGenerate.unpackable = fields.unpackable;
                    productGenerate.unpackableAmount = fields.unpackableAmount;
                    productGenerate.hasPromotion = fields.hasPromotion;
                    productGenerate.PromotionlowestNum = fields.promotionLowestNum;
                    productGenerate.PromotionPrice = fields.promotionPrice;
                    console.log(productGenerate);
                    productGenerate.save();
                    res.send(productGenerate);
                }
            })
        }
    })
})


// app.get('/static/:anything', (req, res, next)=>{
//     res.redirect('https://luffy.ee.ncku.edu.tw/~Shang/TuanTuanGO/main.html');
// })


// app.use('/static', express.static('./public'));