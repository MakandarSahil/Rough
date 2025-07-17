import { Router } from 'express';
import { User } from './user.model';
import jwt from 'jsonwebtoken';

const router = Router();

router.route('/register').post(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    user.password = '';
    res.status(201).json({ msg: 'User Registerd Succefully', data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.route('/login').post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(401).json({ msg: 'User not found' });
      return;
    }

    if (password !== userExist?.password) {
      res.status(400).json({ msg: 'password is incorrect' });
    }

    const accessToken = jwt.sign(
      {
        id: userExist?._id,
      },
      '1234',
      {
        expiresIn: '1m',
      },
    );

    const refreshToken = jwt.sign(
      {
        id: userExist?._id,
      },
      '1234',
      {
        expiresIn: '30d',
      },
    );

    userExist.refreshToken = refreshToken;
    await userExist.save();
    console.log(userExist);

    res.status(201).json({
      msg: 'login successfull',
      accessToken,
      refreshToken,
      id: userExist?._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.route('/me').get(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ msg: 'No token provided' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, '1234');
    console.log(payload);
    // const user = await User.findById(payload);
    res
      .status(200)
      .json({ msg: 'User fetched successfully', isVerified: true });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ msg: 'Invalid or expired token', isVerified: false });
  }
});

router.route('/refresh').post(async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: 'Refresh token missing' });
    }

    jwt.verify(refreshToken, '1234', async (err: any, decoded:any) => {
      if (err) {
        return res.status(403).json({ msg: 'Invalid refresh token' });
      }

      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ msg: 'Unauthorized' });
      }

      const newAccessToken = jwt.sign(
        { id: user._id },
        '1234',
        { expiresIn: '1m' }
      );

      console.log('new access token sent', 
        newAccessToken
      );

      res.status(200).json({
        msg: 'New access token issued',
        accessToken: newAccessToken,
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

export default router;
