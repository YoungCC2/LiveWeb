const fileType = (type)=>{
    if(type==="MP3"||type==="WAV"||type==="WMA"||type==="OGG"){
        return "aud";
    }else if(type==="JPG"||type==="JPEG"||type==="PNG"||type==="BMP"){
        return "img";
    }else {
        return "oth";
    }
}

module.exports = {
    fileType
};