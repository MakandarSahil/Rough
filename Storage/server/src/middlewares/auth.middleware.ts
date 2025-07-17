import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { JwtPayload } from '../types/global';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }
  
  const token = authHeader.slice(7);
  
  try {
    // const payload = jwt.verify(token, '1234') as { id: string };
    const payload = jwt.verify(token, '1234') as JwtPayload;
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    
    // Attach the decoded payload to the request
    req.user = {
      jti: payload.jti,
      userId: payload.userId,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp
    };
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid or expired token', isVerified: false });
  }
};