import express from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/user';
import { IUser } from '../interfaces/user';


class LoginController {
    public router = express.Router();
    public refreshTokens: { [key: string]: string; } = {}
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
                const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
                const refreshToken = jwt.sign(tokenContent, 'secret', { expiresIn: 60 * 60 * 24 });
                this.refreshTokens[refreshToken] = data.id;
                
                res.set('Authorization', 'Bearer ' + token);
                return res.send({refreshToken: refreshToken});
            } 
            
            return res.status(401).json({authorized: false}); 
        })    
    }

    private token(req: express.Request, res: express.Response) {
        const id: string = req.body.id;
        const refreshToken: string = req.body.refreshToken;
        
        if((refreshToken in this.refreshTokens) && (this.refreshTokens[refreshToken] == id)) {
            const token = jwt.sign({ id: id }, 'secret', { expiresIn: 60 });
            res.set('Authorization', 'Bearer ' + token);
            return res.json({authorized: true}); 
        } 
            
        return res.status(401).json({authorized: false}); 
    }
}

export default LoginController;
