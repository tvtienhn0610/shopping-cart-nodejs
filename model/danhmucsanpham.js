var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var danhmucspSchema = new mongoose.Schema({ 
         name_dmsp: 'string'
     },{collection:"danhmucsanpham"
});


module.exports = mongoose.model('danhmucsanpham',danhmucspSchema ,'danhmucsanpham');
