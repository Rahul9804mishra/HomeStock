import mongoose from 'mongoose';
const schema=new mongoose.Schema({productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},type:{type:String,enum:['PURCHASE','CONSUMED','ADJUSTMENT'],required:true},quantity:{type:Number,min:0,required:true},previousQuantity:{type:Number,min:0,required:true},newQuantity:{type:Number,min:0,required:true},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}},{timestamps:{createdAt:true,updatedAt:false}});
export default mongoose.model('StockHistory',schema);
