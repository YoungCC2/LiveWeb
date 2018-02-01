var express = require('express');
var router = express.Router();
router.get('/user', function(req, res, next) {
    res.send('user');
})

router.get('/', function (req, res) {
    res.send('user home page');
});
module.exports = router;