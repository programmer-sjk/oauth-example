import express from 'express';
import jwt from 'jsonwebtoken'
import { getAccount } from '../models/account';
import { Account } from '../interfaces/account';


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

    private login(request: express.Request, response: express.Response) {
        const id: string = request.body.id;
        const password: string = request.body.password;
        
        getAccount((err: Error, data: Account) => {
            if(id === data.id && password === data.password) {
                request.session!.isLogin = true
                const tokenContent = { id: data.id }
                const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
                const refreshToken = jwt.sign(tokenContent, 'secret', { expiresIn: 60 * 60 * 24 });
                this.refreshTokens[refreshToken] = data.id;
                
                //response.set('Authorization', 'Bearer ' + token);
                return response.send({refreshToken: refreshToken});
            } 
            
            return response.status(401).json({authorized: false}); 
        })    
    }

    private token(request: express.Request, response: express.Response) {
        const id: string = request.body.id;
        const refreshToken: string = request.body.refreshToken;
        
        if((refreshToken in this.refreshTokens) && (this.refreshTokens[refreshToken] == id)) {
            const token = jwt.sign({ id: id }, 'secret', { expiresIn: 60 });
            response.set('Authorization', 'Bearer ' + token);
            return response.json({authorized: true}); 
        } 
            
        return response.status(401).json({authorized: false}); 
    }
}

export default LoginController;
