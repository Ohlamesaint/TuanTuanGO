const mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var cors = require("cors");
var app = express();
const formidable = require('formidable');
var session = require("express-session");
var create= require("./blockchain/create");
const { createReadStream } = require('fs');
const { createModel } = require('mongoose-gridfs');
const webpush = require('web-push');

const corsOption = {
    origin:[
        "https://ohlamesaint.github.io",
        "http://haohao.git.ismplab.com",
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
            res.send({
                "signin": true, 
                "user": result.user, 
                "username": result.username, 
                "headPaste": result.headPaste, 
                "phoneNumber": result.phoneNumber,
                "email": result.email,
                "address": result.address
            });
            return; 
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
                webpush.setVapidDetails(
                    'mailto:mkop9456@gmail.com',
                    "BDS16gOHo-U1qqgD6cGbLMTEZe_lrbgk3aKAs3T38YQiFvoucK7hSRjJUJhuj8e4_PxqIWm-CWc3OFOi2sSXbZI",
                    'jHbtNwxKgiGaUHr7VRDqGfY8Qt6F0vG5DZp_0o9nOws'
                )
                webpush.sendNotification(pushConfig, payload);
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


app.get("/products/:check", async (req, res, next)=>{
    if(/[\d]{6}/.test(req.params.check)){
        let productID = req.params.check;
        let result = await waitForDB(productID);
        if(result){
            console.log(result);
            res.send(result);
        } else {
            console.log("error! not such ID")
            res.send('error! not such ID')
        }
    }else{
        res.send('wrong FORMATE')
    }
})

app.get('/userwallet', async (req, res, next) => {
    if(!req.session.signin){
        console.log("fail");
        res.send({"signin": false});
        console.log(req.session);
        return;
    } else {
        UserProfile.checkAccount(req.session.username, (userResult) => {
            if(userResult){
                console.log(userResult);
                create.inquery(userResult.walletAddress).then((result) => {
                    console.log(result);
                    res.send({"balance": result, "signin": true, account: userResult.walletAddress})
                })
            } else {
                console.log('unexpected error');
                res.send('unexpected error')
            }
        })
    }
})

app.post('/sendMoney', async (req, res, next) => {
    if(!req.session.signin){
        console.log("fail");
        res.send({"signin": false});
        console.log(req.session);
        return;
    } else {
        UserProfile.checkAccount(req.session.username, (userResult) => {
            if(userResult){
                create.send(userResult.walletAddress, req.body.money).then((result) => {
                    create.inquery(userResult.walletAddress).then((resultMoney) => {
                        res.send({"balance": resultMoney, "success": true});
                    })
                })
            } else {
                console.log('unexpected error');
                res.send({"success": false});
            }
        })
    }
})

function joinTuanGOFunc(username, TuanGOAddress, amount){
    UserProfile.checkAccount(username, (res)=>{
        if(res){
            res.joinTuanGOAddress.push(TuanGOAddress);
            res.save();
        }else{
            throw new Error("cannot not join");
        }
    })
    
    TuanGO.findTuanGOByAddress(TuanGOAddress, (res)=>{
        if(res){
            res.members.push(username);
            res.SoldAmounts.push(amount);
            res.save();
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
                joinTuanGOFunc(req.session.username, data.contractAddress, data.amount);
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

app.post("/deploy", async (req, res, next)=>{
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
        SoldAmounts: [],
        TotalAmount: 0
    });
    let productRes = await waitForDB(data.productID);
    if(productRes){ 
        console.log(productRes);
        TuanGOGenerate.price = productRes.price;
        TuanGOGenerate.productType = productRes.productType;
        if(data.type === 1){
            TuanGOGenerate.TotalAmount = productRes.unpackableAmount
            create.deploy_unpack(productRes.unpackableAmount, Math.floor(productRes.price), TuanGOGenerate.duration).then((result)=>{
                TuanGOGenerate.price = productRes.price;
                TuanGOGenerate.TuanGOAddress = result;
                console.log(JSON.stringify(TuanGOGenerate));
                TuanGOGenerate.save();
                res.send({"contractAddress": result});
            });
        }else if(data.type === 0){
            TuanGOGenerate.TotalAmount = productRes.PromotionLowestNum;
            console.log('brfore');
            create.deploy(productRes.PromotionlowestNum, productRes.price, Math.floor(productRes.PromotionPrice), TuanGOGenerate.duration).then((result)=>{
                console.log('after');
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
})

const mainPageResponse = function(){
    this.productName = "";
    this.originalPrice = 0;
    this.ExpirationTime = "";
    this.disccountPrice = 0;
    this.TuanGOType = 0;
    this.TuanGOAddress = "";
    this.TuanGOmembers = [];
    this.TotalAmount = 0;
    this.SoldAmounts = [];
}


const PushSubsciption = (endpoint, p256dh, auth) => {
    endpoint = this.endpoint,
    keys = {
        p256dh: this.p256dh,
        auth: this.auth
    }
}
const payload = JSON.stringify({title: "tuantuanGO", content: "your tuanGO is ready!"});
const options = {
    vapidDetails : {
        
    }
}

const subject = 'mailto:mkop9456@gmail.com';
const publicKey = "BGxHf6ZQkHVoIdROO4Fir61eouPlqUp3IzxsV4ud10FeXgS5vvG9q3Gw5J7lsp2XHnF_49aJ9RxWNV99_TD9--8";
const privateKey = 'Dif3UmuTtyX9iwlvQYCaiIKXBgsk-pK-5TQS_QAosFU'
let pushConfig = {
    endpoint: "https://fcm.googleapis.com/fcm/send/cTSrRcs9Duk:APA91bHf14z6XSb8YOXgjsvrB6CE7OGEOrrwCwHWUsnmvwQRpTIONQkAZkE-dQVAaYiTHHuAlu9jeJplpvQ8fgcNg-0PlNsiHH6kAnXM8Zty2Dm5cG91fzFPpW_vNIifNTl7r5g038Rf",
    keys: {
        auth: "2IU1E2NLpLIN5pVH-ZDW1g",
        p256dh: "BBYbpjYcD2O6X2x1scMQYItiUdHyMOAuiqE8M9z54O0ChHRIifWfNOya0rB2lK-mAKLHgU0CFGgj1aatzlcSfxo"
    }
}


app.post('/subscribe', (req, res) => {
    let data = req.body;
    let newSubscription = new Subscription({
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth
    })
    newSubscription.save();
    webpush.setVapidDetails('mailto:mkop9456@gmail.com', publicKey, privateKey);
    webpush.sendNotification(data, payload).catch((err) => console.log('something went wrong => webpush', err));
})

app.post('/mainPageProducts', (req, res, next)=>{
    
    let data = req.body;
    let responseArray = [];
    TuanGO.findTuanGOByProductType(data.productType, async (result)=>{
        console.log(data.productType);
        if(result){
            console.log("first" + result);
            let ProductInform  = '';
            for(let i=0; i<result.length; i++){
                let response = new mainPageResponse();
                response.ExpirationTime = result[i].ExpirationTime;
                response.TuanGOType = result[i].TuanGOtype;
                response.TuanGOmembers = result[i].members;
                response.TuanGOAddress = result[i].TuanGOAddress;
                response.TotalAmount = result[i].TotalAmount;
                response.SoldAmounts = result[i].SoldAmounts;
                console.log("response outside: "+ response);
                ProductInform = await waitForDB(result[i].productID);
                console.log("after waitForDB: " + ProductInform);
                if(ProductInform){
                    response.productName = ProductInform.productName;
                    response.originalPrice = ProductInform.price;
                    response.disccountPrice = response.TuanGOType?ProductInform.price:ProductInform.PromotionPrice
                    console.log("responseFinished:" + response);
                    responseArray.push(response);
                    console.log("responseArray: " + responseArray);
                } else{
                    console.log('not found  productID');
                }
            } 
            res.send(responseArray);
        } else {
            res.send("not found " + data.productType);
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
    SoldAmounts: [Number],
    TotalAmount: Number
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
    // return new Promise((resolve, reject)=>{
    this.find({"productType": productType}, function(err, docs){
        if(err){
            console.log("not found " + productType);
            return('not Found');
        } 
        else{
            console.log(docs);
            callback(docs);
        }
    })
    // })
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
    phoneNumber: {type: String, required: true},
    email: {type: String, required: true},
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

const waitForDB = function(ID){
    console.log("in waitForDB");
    return Product.findProductByID(ID).then(res=> res).catch((err) => err);
}

productsSchema.statics.findProductByID = function(ID, callback){
    return new Promise((resolve, reject)=>{
        
        this.find({"productID": ID}, function(err, docs){
            if(err){
                reject("not found " + ID);
            }
            else{
                resolve(docs[0]);
            }
        })
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

/**********************註冊訂閱**************************/
subscriptionSchema = new mongoose.Schema({
    endpoint: {type: String, required: true},
    p256dh: {type: String, required: true},
    auth: {type: String, required: true}
})

var Subscription = mongoose.model('Subscription', subscriptionSchema);

/**********************註冊路由**************************/

app.post("/registration", (req, res, next)=>{
    // console.log('req: ', req);
    console.log(req.data);
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
                    phoneNumber: 0,
                    email: "",
                })
                
                console.log(field);
                accountGenerate.username = field.username;
                accountGenerate.password = field.password;
                accountGenerate.user = field.user;
                accountGenerate.region = field.region;
                accountGenerate.address = field.address;
                accountGenerate.phoneNumber = field.phoneNumber;
                accountGenerate.email = field.email;
                create.create(String(field.password)).then((res)=>{
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
    console.log("form: " + JSON.stringify(form));
    form.parse(req, async (err, fields, files)=>{
        if(err){
            throw new Error(err);
        }else {
            let ProductInform = await waitForDB(fields.ID);
            if(ProductInform){
                console.log("ID occupied: "+ProductInform);
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
                console.log("fields: " + JSON.stringify(fields));
                productGenerate.productName = fields.productName;
                productGenerate.productType = fields.productType;
                productGenerate.productID = fields.ID;
                productGenerate.price = fields.price;
                productGenerate.unpackable = fields.unpackable;
                productGenerate.unpackableAmount = fields.unpackableAmount;
                productGenerate.hasPromotion = fields.hasPromotion;
                productGenerate.PromotionlowestNum = fields.promotionLowestNum;
                productGenerate.PromotionPrice = fields.promotionPrice;
                console.log("productGenerate: " + productGenerate);
                productGenerate.save();
                res.send(productGenerate);
            }
        }
    })
})


app.post('/static/:anything', (req, res, next)=>{
    console.log(req.body);
    let form = new formidable.IncomingForm();
    form.uploadDir = "./public/";
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        // use default bucket
        const Attachment = createModel();
        
        // or create custom bucket with custom options
        // const Attachment = createModel({
        //     modelName: 'userPhotos',
        //     connection: connection
        // });
        
        // write file to gridfs
        const readStream = createReadStream(files);             //<= 必須要是ｂｕｆｆｅｒ黨
        const options = ({ filename: files, contentType: 'image/png' });
        Attachment.write(options, readStream, (error, file) => {
            console.log(file);
            console.log("error in Attachmet write: " + error);
        });
        
        // // read larger file
        // const readStream = Attachment.read({ _id });
        
        // // read smaller file
        // Attachment.read({ _id }, (error, buffer) => {  });
        
        // // remove file and its content
        // Attachment.unlink({ _id }, (error) => {  });
        
        res.send("success!");
    })
})


app.use('/static', express.static('./public'));