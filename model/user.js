var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var userSchema = new Schema({ 
         username : 'string',
         password   : 'string',
         phone      :'number',
         address : 'string',
         giohang : [{type : Schema.Types.ObjectId  , ref:'sanpham'}]
     },{collection:"user"
});

userSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}


module.exports = mongoose.model('user',userSchema ,'user');
