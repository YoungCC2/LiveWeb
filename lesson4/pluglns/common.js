var request = require('superagent');
var async = require('async');

const superagentFun = (headerParam, num, url, cb, asyncCb) => {

    function setParam(page, pagebar) {
        
        return {
            ajwvr: '6',
            domain: '100505',
            is_search: '0',
            visible: '0',
            is_all: 1,
            is_tag: 0,
            profile_ftype: '1',
            page: page,
            pagebar: pagebar,
            pl_name: 'Pl_Official_MyProfileFeed__21',
            id: '1005051916825084',
            script_uri: '/p/1005051916825084/home',
            feed_type: '0',
            pre_page: page,
            domain_op: '100505',
            __rnd: '1548663494039'
        }
    }

    function defaultParam(page) {
        
        return {
            is_search: 0,
            visible: 0,
            is_all: 1,
            is_tag: 0,
            profile_ftype: 1,
            page: page
        }
    }

    const tasks = [-1, 0, 1];

    const taskCallback = [];

    tasks.forEach((e) => {
        var objs = "";
        if (e == 1) {
            objs = defaultParam(num);
        } else {
            objs = setParam(num, e);
        }

        const cbs = (callback) => {
            request
                .get(url)
                .set(headerParam)
                .query(objs)
                .end(function (err, sres) {
                    if (err) {
                        throw err;
                    } else {
                        cb(sres, callback);
                    }
                })
        }
        taskCallback.push(cbs);
    });

    async.series(taskCallback, (err, res) => {
        if (!err) {
            
        } else {
            throw err
        }
    })
}

const testFun = () => {
    console.log("sd");
}

//检测url是否带https | http
const matchUrl = (url) => {
    if (!url.search("https") || !url.search("http")) {
        return false;
    } else if (url.search("https") || url.search("http")) {
        return true;
    }
}

//微博图 变大  mw690
const bigImg = (imgStr) => {
    if (imgStr.search("thumb150")) {
        imgStr = imgStr.replace("thumb150", "mw690")
    } else if (imgStr.search("orj480")) {
        imgStr = imgStr.replace("orj480", "mw690")
    } else if (imgStr.search("orj360")) {
        imgStr = imgStr.replace("orj360", "mw690")
    }
    return imgStr;
}

module.exports = {
    superagentFun,
    testFun,
    matchUrl,
    bigImg
}