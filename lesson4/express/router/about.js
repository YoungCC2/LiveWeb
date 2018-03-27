var express = require('express')
var router = express.Router();

router.get("/",(req, res,err)=>{
    res.send("about");
})


module.exports = router;