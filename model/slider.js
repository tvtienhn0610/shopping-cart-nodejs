var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sliderSchema = new mongoose.Schema({ 
         title1: 'string',
         title2 : 'string',
         image : 'array'
     },{collection:"slider"
});


module.exports = mongoose.model('slider',sliderSchema ,'slider');
