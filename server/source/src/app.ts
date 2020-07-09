
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import { getAccount } from './models/account';
import { Account } from './interfaces/account';
import jwt from 'jsonwebtoken'

const refreshTokens: { [key: string]: string; } = {}
const app = express();
app.use(cors({exposedHeaders: 'Authorization'}));
app.use(bodyParser.json());

const port: number = 3000
app.listen(port, () => console.log('Example app listeningg'))

app.get('/', (request: Request, response: Response) => {
    const bearer = request?.headers["authorization"]?.split(" ");
    const token = bearer?.[1];
    if(token) {
        try {
            const decoded_data = jwt.verify(token, 'secret');
            return response.json({authorized: true}); 
        } catch(e) {console.log(e)}
    }
    response.status(401).json({authorized: false}); 
});

app.post('/login', (request: Request, response: Response) => {
    const id: string = request.body.id;
    const password: string = request.body.password;
    
    getAccount((err: Error, data: Account) => {
        if(id === data.id && password === data.password) {
            const tokenContent = { id: data.id }
            const token = jwt.sign(tokenContent, 'secret', { expiresIn: 60 });
            const refreshToken = jwt.sign(tokenContent, 'secret', { expiresIn: 60 * 60 * 24 });
            refreshTokens[refreshToken] = data.id;

            response.set('Authorization', 'Bearer ' + token);
            return response.send({refreshToken: refreshToken});
        } 
        
        return response.status(401).json({authorized: false}); 
    })    
});

app.post('/token', (request: Request, response: Response) => {
    const id: string = request.body.id;
    const refreshToken: string = request.body.refreshToken;
    
    if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == id)) {
        const token = jwt.sign({ id: id }, 'secret', { expiresIn: 60 });
        response.set('Authorization', 'Bearer ' + token);
        return response.json({authorized: true}); 
    } 
        
    return response.status(401).json({authorized: false}); 
});
