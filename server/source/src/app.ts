import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import session from 'express-session';
import passport from 'passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
import { config } from '../config'

import UserController from './controllers/users.controller'
import LoginController from './controllers/login.controller'
import OauthController from './controllers/oauth.controller'

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
    
    private initializeControllers() {
        this.app.use('/', new UserController().router);
        this.app.use('/', new LoginController().router);
        this.app.use('/', new OauthController().router);
    }

    private initializePassport() {
        passport.use(new Strategy({
            clientID: config.google.client_ID,
            clientSecret: config.google.client_secret, 
            callbackURL: "http://localhost:3000/auth/google/callback"
          },
          function(accessToken, refreshToken, profile, cb) {
            console.log(accessToken, refreshToken, profile)
            return cb(undefined, profile);
          }
        ));
        
        passport.use(new NaverStrategy({
                clientID: config.naver.client_ID,
                clientSecret: config.naver.client_secret,
                callbackURL: "http://localhost:3000/auth/naver/callback"
            },
            function(accessToken: string, refreshToken: string, profile: object, cb: any) {
                console.log(accessToken, refreshToken, profile)
                return cb(undefined, profile);
            }
        ))
        
        passport.use(new KakaoStrategy({
                clientID: config.kakao.client_ID,
                callbackURL: "http://localhost:3000/auth/kakao/callback"
            },
            function(accessToken: string, refreshToken: string, profile: object, cb: any) {
                console.log(accessToken, refreshToken, profile)
                return cb(undefined, profile);
            }
        ))
        
        passport.serializeUser((user, done) => {
            done(null, user); 
        });
        
        passport.deserializeUser((user, done) => {
            done(null, user); 
        });

        this.app.use(passport.initialize()); 
        this.app.use(passport.session());
    }
    
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
 
new App(3000)
