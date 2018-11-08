var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var danhmucnewSchema = new mongoose.Schema({ 
         cates_name: 'string'
     },{collection:"danhmuctintuc"
});


module.exports = mongoose.model('danhmuctintuc',danhmucnewSchema ,'danhmuctintuc');
