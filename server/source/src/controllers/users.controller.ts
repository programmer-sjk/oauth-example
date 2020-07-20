import express from 'express';
import { getAccount } from '../models/account';
import { Account } from '../interfaces/account';

class UserController {
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get('/user', this.getUser);
    }

    private getUser(request: express.Request, response: express.Response) {
        getAccount((err: Error, data: Account) => {
            response.send(data.id)
        })
    }
}

export default UserController;
