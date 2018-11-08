var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sanphamSchema = new Schema({ 
         tensp : 'string',
         gia   : 'number',
         thongtin : 'string',
         soluong  : 'number',
         anhsp : 'array',
         danhmuc :{ type : Schema.Types.ObjectId , ref:'danhmucsanpham'}
     },{collection:"sanpham"
});


module.exports = mongoose.model('sanpham',sanphamSchema ,'sanpham');
