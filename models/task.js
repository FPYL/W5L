let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
     taskname : String,
     status : String,
     description : String,
     duedate : {
         type : Date,
         default : Date.now
     },
     developer : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'developer'
     }
 });
 
 let taskModel = mongoose.model('task',taskSchema,'task');
 module.exports = taskModel;