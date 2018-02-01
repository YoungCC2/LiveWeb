var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var indexRouter = require('./routers/indexRouter')
var userRouter = require('./routers/userRouter')
var birds = require('./birds');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/birds', birds);

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});