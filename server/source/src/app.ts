
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import session from 'express-session';
import cors from "cors";
import jwt from 'jsonwebtoken'
import passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { getAccount } from './models/account';
import { Account } from './interfaces/account';
import { config } from '../config'

passport.use(new Strategy({
    clientID: config.client_ID,
    clientSecret: config.client_secret, 
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile)
    return cb(undefined, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user); 
});

passport.deserializeUser((user, done) => {
    done(null, user); 
});

const allowRoutes = ['/login', '/token', '/login/google', '/auth/google/callback']
const refreshTokens: { [key: string]: string; } = {}
const app = express();
app.use(cors({exposedHeaders: 'Authorization'}));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60 },
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session());
app.use((request: Request, response: Response, next: NextFunction) => {
    if(allowRoutes.includes(request.path))
        return next();
    
    const bearer = request?.headers["authorization"]?.split(" ");
    const token = bearer?.[1];
    
    if(token) {
        try {
            const decoded_data = jwt.verify(token, 'secret');
            return next();
        } catch(e) {console.log(e)}
    } 
    response.status(401).json({authorized: false});
})

const port: number = 3000
app.listen(port, () => console.log('Example app listeningg'))

app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    const tokenContent = { id: 'aa' }
    const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
    res.redirect('http://localhost/home?token=' + token);
});

app.get('/user', (request: Request, response: Response) => {
    getAccount((err: Error, data: Account) => {
        response.send(data.id)
    })
});

app.post('/login', (request: Request, response: Response) => {
    const id: string = request.body.id;
    const password: string = request.body.password;
    
    getAccount((err: Error, data: Account) => {
        if(id === data.id && password === data.password) {
            const tokenContent = { id: data.id }
            const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
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

