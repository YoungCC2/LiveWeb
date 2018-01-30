const mongoose = require('../connetDB'),
    Schema = mongoose.Schema;
const SoundsSchema = new Schema({
    viewname: String,
    typename: String,
    ViewsPoint: {
            coverImgUrl: String,
            epname: String,
            singer: String,
            src: String,
            title: String
    },
    date: {
        type: String,
        default: Date.parse(new Date)
    },
    uuid: String
}, {
    autoIndex: true,
    connection: 'Sounds'
});

module.exports = mongoose.model("Sounds", SoundsSchema);