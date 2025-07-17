import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

class AuthService {
  public async register(name: string, email: string, password: string) {
    const user = await User.create({ name, email, password });
    user.password = '';
    return user;
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw { status: 401, message: 'User not found' };
    }

    if (password !== user.password) {
      throw { status: 400, message: 'Password is incorrect' };
    }

    const accessToken = jwt.sign({ id: user._id }, '1234', { expiresIn: '1m' });
    const refreshToken = jwt.sign({ id: user._id }, '1234', { expiresIn: '30d' });

    user.refreshToken = refreshToken;
    await user.save();

    return {
      msg: 'Login successful',
      accessToken,
      refreshToken,
      id: user._id,
    };
  }

  public async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw { status: 401, message: 'Refresh token missing' };
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, '1234', async (err: any, decoded: any) => {
        if (err) {
          return reject({ status: 403, message: 'Invalid refresh token' });
        }

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
          return reject({ status: 403, message: 'Unauthorized' });
        }

        const newAccessToken = jwt.sign(
          { id: user._id },
          '1234',
          { expiresIn: '1m' }
        );

        resolve(newAccessToken);
      });
    });
  }
}

export default AuthService;