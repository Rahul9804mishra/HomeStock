import mongoose from 'mongoose';
const productSchema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:120},category:{type:String,required:true},quantity:{type:Number,min:0,required:true},unit:{type:String,required:true},minimumStock:{type:Number,min:0,default:1},price:{type:Number,min:0,default:0},purchaseDate:{type:Date},expiryDate:{type:Date},location:{type:String,trim:true,maxlength:100},notes:{type:String,trim:true,maxlength:1000},userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}},{timestamps:true});
productSchema.index({userId:1,name:1});
export default mongoose.model('Product',productSchema);
