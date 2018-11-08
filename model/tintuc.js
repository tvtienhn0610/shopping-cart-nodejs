var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tintucSchema = new Schema({ 
         title : 'string',
         time   : 'date',
         imgage : 'array',
         content : 'string',
         cates :{ type : Schema.Types.ObjectId , ref:'danhmuctintuc'}
     },{collection:"news"
});


module.exports = mongoose.model('news',tintucSchema ,'news');
