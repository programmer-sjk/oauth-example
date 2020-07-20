import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import session from 'express-session';
import passport from 'passport';

import UserController from './controllers/users.controller'
import LoginController from './controllers/login.controller'
import OauthController from './controllers/oauth.controller'

import { googleStrategy, naverStrategy, kakaoStrategy } from './utils/passport'

class App {
    public app: express.Application;
    public port: number;
    
    constructor(port) {
        this.app = express();
        this.port = port;
        this.listen()
    
        this.initializeMiddlewares();
        this.initializePassport();
        this.initializeControllers();
    }
    
    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors({exposedHeaders: 'Authorization'}));
        this.app.use(session({
            secret: 'secret',
            cookie: { maxAge: 60 },
            resave: true,
            saveUninitialized: false
        }));
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
