import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, '1234', { expiresIn: '1m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, '1234', { expiresIn: '30d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, '1234');
};