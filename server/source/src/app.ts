
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import { getAccount } from './models/account';
import { Account } from './interfaces/account';
import jwt from 'jsonwebtoken'

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port: number = 3000
app.listen(port, () => console.log('Example app listeningg'))

app.get('/', (request: Request, response: Response) => {
    const bearer = request?.headers["authorization"]?.split(" ");
    const token = bearer?.[1];
    if(token) {
        try {
            const decoded_data = jwt.verify(token, 'secret');
            return response.send('valid')
        } catch(e) {}
    }
    response.send('not valid');
});

app.post('/login', (request: Request, response: Response) => {
    const id: string = request.body.id;
    const password: string = request.body.password;
    
    getAccount((err: Error, data: Account) => {
        if(id === data.id && password === data.password) {
            const token = jwt.sign({ data: 'foobar' }, 'secret', { expiresIn: 60 * 60 });
            console.log(token)
            response.send(data);
        }
        else
            response.status(401).send('error');
    })    
});
