var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema = new mongoose.Schema({ 
     username: 'string',
     password: 'string' 
     },{collection:"admin"
});

adminSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

adminSchema.methods.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}

module.exports = mongoose.model('admin',adminSchema ,'admin');
