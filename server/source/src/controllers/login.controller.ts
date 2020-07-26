import express from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/user';
import Token from '../models/token';
import { IUser } from '../interfaces/user';


class LoginController {
    public router = express.Router();
 
    constructor() {
        this.intializeRoutes();
    } 

    private intializeRoutes() {
        this.router.post('/login', this.login.bind(this));
        this.router.post('/token', this.token.bind(this))
    }

    private login(req: express.Request, res: express.Response) {
        const id: string = req.body.id;
        const password: string = req.body.password;
        
        const user = new User();
        user.getUser((err: Error, data: IUser) => {
            if(id === data.id && password === data.password) {
                const tokenContent = { id: data.id }
                const token = new Token()

                const accessToken = token.getToken(tokenContent)
                const refreshToken = token.getRefreshToken(tokenContent)
                token.setRefreshToken(data.id, refreshToken)
                
                res.set('Authorization', 'Bearer ' + accessToken);
                return res.send({refreshToken: refreshToken});
            } 
            
            return res.status(401).json({authorized: false}); 
        })    
    }

    private token(req: express.Request, res: express.Response) {
        const id: string = req.body.id;
        const refreshToken: string = req.body.refreshToken;
        
        const token = new Token()
        if(token.checkRefreshTokenExist(id, refreshToken)) {
            const accessToken = token.getToken({id: id})
            res.set('Authorization', 'Bearer ' + accessToken);
            return res.json({authorized: true}); 
        } 

        return res.status(401).json({authorized: false}); 
    }
}

export default LoginController;
