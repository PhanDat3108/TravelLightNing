const mongoose = require('mongoose');
module.exports.connect=()=>{
    try{mongoose.connect(process.env.DATABASELINK);}
    catch(err){
        console.log(err)
    }
}