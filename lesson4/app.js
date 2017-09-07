var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

var topicUrls = require('./conf.json');

var ep = new eventproxy();

ep.after('topic_html', topicUrls.length, function (topics) {
    topics = topics.map(function (topicPair,k) {
        var topicUrl = topicPair[k]['title'];
        if(topicUrl.slice(0,1)=="/"){
           topicUrl = "https://www.zhihu.com" + topicUrl;
        }
        var topicHtml = topicPair[1];
//        console.log(topicHtml);
        var $ = cheerio.load(topicHtml);
        return ({
            title: $('#QuestionAnswers-answers').find('img').attr('data-original')
        });
    });

    /*      console.log('final:');
          console.log(topics);*/
});

topicUrls.forEach(function (topicUrl) {
    /*if(topicUrl.slice(0,1)=="/"){
           topicUrl = "https://www.zhihu.com" + topicUrl;
    }else{
        topicUrl = topicUrl['title'];
    }*/
    if(typeof(topicUrl) == "string"){
        console.log('0');
    }
    
    /*superagent.get(topicUrl)
        .end(function (err, res) {
//            console.log('fetch ' + topicUrl + ' successful');
            ep.emit('topic_html', [topicUrl, res.text]);
        });*/
});