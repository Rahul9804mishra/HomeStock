import mongoose from 'mongoose';
const schema=new mongoose.Schema({productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},quantity:{type:Number,min:0,required:true},unit:{type:String,required:true},amount:{type:Number,min:0,required:true},category:{type:String,required:true},purchaseDate:{type:Date,required:true},store:{type:String,trim:true,maxlength:120},notes:{type:String,trim:true,maxlength:1000},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}},{timestamps:{createdAt:true,updatedAt:true}});
export default mongoose.model('Purchase',schema);
