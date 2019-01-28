var request = require('superagent');


const superagentFun = (headerParam, queryParam, url, cb, asyncCb) => {
    request
        .get(url)
        .set(headerParam)
        .query(queryParam)
        .end(function (err, sres) {
            if (err) {
                throw err;
            } else {
                cb(sres);
            }
        })
}

const testFun = () => {
    console.log("sd");
}

module.exports = {
    superagentFun,
    testFun
}