/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {NextFunction, Request, Response} from 'express';
import {ConnectDB} from './db';
import auth from './auth.controller';
import cors from 'cors';

const app = express();

function StartServer() {
  ConnectDB()
    .then(() => {
      app.use(express.json());
      app.use(auth);
      app.use(
        cors({
          origin:'http://localhost:8081',
        }),
      );
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).json({
          message: 'Something went wrong. Please try again later.',
        });
      });

      app.get('/', (req, res) => res.send('hello'));

      app.listen(3000, '0.0.0.0', () => {
        console.log('server started at http://localhost3000');
      });
    })
    .catch(err => {
      console.log('Error: ', err);
    });
}

StartServer();
