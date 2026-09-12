import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next){try{const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({message:'Authentication required'});const token=h.split(' ')[1];const decoded=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(decoded.id).select('-password');if(!user)return res.status(401).json({message:'User no longer exists'});req.user=user;next();}catch(e){return res.status(401).json({message:'Invalid or expired token'});}}
