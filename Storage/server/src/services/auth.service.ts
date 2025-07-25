import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import redisClient from '../config/redis.config';
import { getUuId } from '../utils/uuid';

class AuthService {
  public async register(name: string, email: string, password: string) {
    const external_id = getUuId();
    const user = await User.create({ name, email, password, external_id });
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

    const rt_jti = getUuId();

    const accessToken = jwt.sign({ userId: user._id }, '1234', {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user._id, jti: rt_jti }, '1234', {
      expiresIn: '30d',
    });

    user.refreshToken = refreshToken;
    await user.save();
    await redisClient.set(`refresh_token:${user._id}:`, rt_jti, {
      EX: 30 * 24 * 60 * 60,
    });
    console.log("login service: ", user.external_id);

    return {
      msg: 'Login successful',
      accessToken,
      refreshToken,
      externalId: user.external_id,
      id: user._id as string,
    };
  }

  private verifyJwt(token: string, secret: string): Promise<jwt.JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as jwt.JwtPayload);
      });
    });
  }

  public async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw { status: 401, message: 'Refresh token missing' };
    }

    try {
      const decoded = await this.verifyJwt(refreshToken, '1234');

      if (!decoded.jti) {
        throw { status: 400, message: 'Invalid token payload - jti missing' };
      }

      let storedRtJti = await redisClient.get(`refresh_token:${decoded.jti}`);

      if (!storedRtJti) {
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
          throw { status: 403, message: 'Unauthorized - fallback failed' };
        }

        await redisClient.set(`refresh_token:${decoded.userId}`, decoded.jti, {
          EX: 30 * 24 * 60 * 60,
        });
      }

      const jti = getUuId();

      const newAccessToken = jwt.sign({ id: decoded.userId, jti }, '1234', {
        expiresIn: '15m',
      });

      return newAccessToken;
    } catch (err) {
      throw { status: 403, message: 'Invalid or expired refresh token' };
    }
  }
}

export default AuthService;
