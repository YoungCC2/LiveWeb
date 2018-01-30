const Sounds = require("../Schema_Model/sounds");
const insertData = (data) => {
    return datas = new Sounds(data);
}

const findData = () =>{
    return Sounds;
}

module.exports = {
    insertData,
    findData
}