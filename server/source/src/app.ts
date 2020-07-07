import express, { Request, Response } from 'express';

const app = express();

const port: number = 3000
app.listen(port, () => {
  console.log('Example app listeningg')
})

app.get('/', (request: Request, response: Response) => {
    response.send('hello');
});
