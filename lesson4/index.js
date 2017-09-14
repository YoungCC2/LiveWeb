var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var indexRouter = require('./routers/indexRouter')
var userRouter = require('./routers/userRouter')

app.use('./', indexRouter);
app.use('./users', userRouter);
app.listen(3000);