var mongoose = require('./alimongoDb'),
        Schema = mongoose.Schema;
//定义集合数据类型  对集合结构定义
var ImgSchema = new Schema({          
    filename : { type: String },                    
    uploadDate: {type: String}                   
});

var IMG = mongoose.model('ImgSchema',ImgSchema);
function insert() {
    var image = new IMG({
        filename:"001.jpg",
        uploadDate:new Date()
    });

    image.save(function (err, res) {

        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }

    });
}


module.exports = {insert};