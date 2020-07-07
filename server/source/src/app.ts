
import express, { Request, Response } from 'express';
import cors from "cors";

const app = express();
app.use(cors());

const port: number = 3000
app.listen(port, () => {
  console.log('Example app listeningg')
})

app.get('/', (request: Request, response: Response) => {
    response.send('hello');
});
