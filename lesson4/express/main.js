var express = require('express')
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var submain = require('./subMain');
var index = require ("./router/")
var about = require("./router/about")
app.use('/birds', submain);
app.use("/",index)
app.use("/about",about)

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});