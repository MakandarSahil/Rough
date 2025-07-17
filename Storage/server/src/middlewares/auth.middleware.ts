import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  
  const token = authHeader.slice(7);
  
  try {
    const payload = jwt.verify(token, '1234') as { id: string };
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid or expired token', isVerified: false });
  }
};