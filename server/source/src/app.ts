import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import session from 'express-session';
import passport from 'passport';
import jwt from 'jsonwebtoken'

import UserController from './controllers/users.controller'
import LoginController from './controllers/login.controller'
import OauthController from './controllers/oauth.controller'

import { googleStrategy, naverStrategy, kakaoStrategy } from './utils/passport'

class App {
    public app: express.Application;
    public port: number;
    public allowUrls: Array<String>;
    
    constructor(port) {
        this.app = express();
        this.port = port;
        this.listen()
        this.allowUrls = ['login', 'auth', 'token' ]
    
        this.initializeMiddlewares();
        this.initializeLoginCheck();
        this.initializePassport();
        this.initializeControllers();
    }
    
    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors({exposedHeaders: 'Authorization'}));
        this.app.use(session({
            secret: 'secret',
            cookie: { maxAge: 60 * 1000 },
            resave: true,
            saveUninitialized: false
        }));
    }

    private initializeLoginCheck() {
        this.app.use((req, res, next) => {
            const firstUrlPath = req.path.split('/')[1]
            if(this.allowUrls.includes(firstUrlPath)) {
                return next();
            } 

            const bearer = req?.headers["authorization"]?.split(" ");
            const token = bearer?.[1];
            if(token) {
                try {
                    const decoded_data = jwt.verify(token, 'secret');
                    return next();
                } catch(e) {console.log(e)}
            } 
            res.status(401).json({authorized: false});
        })
    }

    private initializePassport() {
        passport.use(googleStrategy);
        passport.use(naverStrategy);
        passport.use(kakaoStrategy);
        
        passport.serializeUser((user, done) => done(null, user))
        passport.deserializeUser((user, done) => done(null, user))
          
        this.app.use(passport.initialize()); 
        this.app.use(passport.session());
    }

    private initializeControllers() {
        this.app.use('/', new UserController().router);
        this.app.use('/', new LoginController().router);
        this.app.use('/', new OauthController().router);
    }
    
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
 
new App(3000)
