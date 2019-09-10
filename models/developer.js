let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
     name : {
         firstname:{
            type: String,
            require : true
         },
         lastname: {
            type: String
         }
    },
     level : {
         type: String
     },
     address : {
        state:{
             type:String
        },
        suburb:{
            type:String
        },
        street:{
            type:String
        },
        unit:{
            type:String
        }
    }
 });
 
 let developerModel = mongoose.model('developer',developerSchema,'developer');
 module.exports = developerModel;