var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var emailsubSchema = new mongoose.Schema({ 
         email: 'string'
     },{collection:"emailsub"
});


module.exports = mongoose.model('emailsub',emailsubSchema ,'emailsub');
