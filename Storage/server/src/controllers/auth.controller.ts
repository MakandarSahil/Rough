import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { User } from '../models/user.model';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await this.authService.register(name, email, password);
      res.status(201).json({ msg: 'User Registered Successfully', data: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 500).json({ msg: error.message || 'Internal server error' });
    }
  };

  public getMe = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      
      res.status(200).json({ 
        msg: 'User fetched successfully', 
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        } 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Internal server error' });
    }
  };

  public refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      const accessToken = await this.authService.refreshToken(refreshToken);
      res.status(200).json({
        msg: 'New access token issued',
        accessToken,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 500).json({ msg: error.message || 'Internal server error' });
    }
  };
}

export default AuthController;