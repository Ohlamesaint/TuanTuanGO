var cors = require("cors");

const corsOption = {
    origin:[
        "https://luffy.ee.ncku.edu.tw"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With', 'Range']
}

module.exports = cors;