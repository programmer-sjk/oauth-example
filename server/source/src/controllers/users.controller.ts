import express from 'express';
import User from '../models/user';
import { IUser } from '../interfaces/user';
//
import Token from '../models/token';

class UserController {
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get('/user', this.getUser);
    }

    private getUser(req: express.Request, res: express.Response) {
        const user = new User();
        user.getUser((err: Error, data: IUser) => {
            res.send(data.id)
        })
    }
}

export default UserController;
