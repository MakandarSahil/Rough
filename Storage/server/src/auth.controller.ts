import {Router} from 'express';
import {User} from './user.model';
import jwt from 'jsonwebtoken';

const router = Router();

router.route('/register').post(async (req, res) => {
  try {
    const {name, email, number, password} = req.body;
    const user = await User.create({
      name,
      email,
      number,
      password,
    });
    res.status(201).json({msg: 'User Registerd Succefully', data: user});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Internal server error'});
  }
});

router.route('/login').post(async (req, res) => {
  try {
    const {email, password} = req.body;
    const userExist = await User.findOne({email});
    if (!userExist) {
      res.status(401).json({msg: 'User not found'});
      return;
    }

    if (password !== userExist?.password) {
      res.status(400).json({msg: 'password is incorrect'});
    }

    const accessToken = jwt.sign(
      {
        id: userExist?._id,
      },
      '1234',
      {
        expiresIn: '15m',
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

    res.status(201).json({msg:'login successfull', accessToken, refreshToken, id: userExist?._id});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Internal server error'});
  }
});

export default router;
