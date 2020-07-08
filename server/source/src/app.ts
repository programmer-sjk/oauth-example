
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import { getAccount } from './models/account';
import { Account } from './interfaces/account';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port: number = 3000
app.listen(port, () => console.log('Example app listeningg'))

app.get('/', (request: Request, response: Response) => {
    response.send('hello');
});

app.post('/login', (request: Request, response: Response) => {
    const id: string = request.body.id;
    const password: string = request.body.password;
    
    getAccount((err: Error, data: Account) => {
        if(id === data.id && password === data.password) {
            response.send(data);
        }
        else
            response.send('error');
    })    
});
