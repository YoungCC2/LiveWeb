var express = require('express');
var router = express.Router();

router.get("/index",(req, res,err)=>{
    res.send("index")
})


module.exports = router;