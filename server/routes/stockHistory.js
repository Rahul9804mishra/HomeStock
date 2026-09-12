import {Router} from 'express';import {protect} from '../middleware/auth.js';import {list} from '../controllers/stockController.js';const r=Router();r.get('/',protect,list);export default r;
