import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:120},productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},quantity:{type:Number,min:0,required:true},unit:{type:String,required:true},estimatedPrice:{type:Number,min:0,default:0},priority:{type:String,enum:['LOW','MEDIUM','HIGH'],default:'MEDIUM'},purchased:{type:Boolean,default:false},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}},{timestamps:{createdAt:true,updatedAt:false}});
export default mongoose.model('ShoppingItem',schema);
