import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
// import { JwtPayload } from '../types/global';
import { User } from '../models/user.model';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;
      
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
      }

      const user = await this.authService.register(name, email, password);
      
      // Remove sensitive data before sending response
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

      return res.status(201).json({ 
        msg: 'User registered successfully', 
        data: userResponse 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
      
      return res.status(500).json({ 
        msg: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  /**
   * Login user and return JWT tokens
   */
  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
      }

      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(error.status || 500).json({ 
        msg: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

  /**
   * Get current user profile
   */
  public getMe = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userPayload = req.user;
      console.log(userPayload)
      
      if (!userPayload) {
        return res.status(401).json({ msg: 'Unauthorized', isVerified: false });
      }
      
      // Fetch fresh user data from database
      const user = await User.findById(userPayload.userId)
        .select('-password -refreshToken -__v')
        .lean();

        console.log(user);


      if (!user) {
        return res.status(404).json({ msg: 'User not found', isVerified: false });
      }

      return res.status(200).json({ 
        msg: 'User profile fetched successfully', 
        user: {
          ...user,
          id: user._id
        },
        isVerified: true
      });
    } catch (error) {
      console.error('GetMe error:', error);
      return res.status(500).json({ 
        msg: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Refresh access token using refresh token
   */
  public refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ msg: 'Refresh token is required' });
      }

      const accessToken = await this.authService.refreshToken(refreshToken);
      return res.status(200).json({
        msg: 'New access token issued',
        accessToken,
      });
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return res.status(error.status || 500).json({ 
        msg: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

  /**
   * Logout user by invalidating refresh token
   */
  public logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userPayload = req.user;
      
      if (!userPayload) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }

      // Clear refresh token from database
      await User.findByIdAndUpdate(userPayload.userId, { 
        $unset: { refreshToken: 1 } 
      });

      return res.status(200).json({ 
        msg: 'Logged out successfully' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ 
        msg: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };
}

export default AuthController;