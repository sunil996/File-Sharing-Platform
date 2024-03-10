const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
     
 originalName:{
    type:String,
    required:true
 },
 path:{
    type:String,
    required:true
 },
 size:{
   type:String,
   required:true
 },
 password:String,
 
 downloadCount:{
    type:Number,
    required:true,
    default:0
 }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);


  