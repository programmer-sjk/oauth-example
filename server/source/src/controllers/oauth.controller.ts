import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'

import Token from '../models/token';

class OauthController {
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get('/login/google', passport.authenticate('google', { 
            scope: ['profile', 'email', 'openid'], accessType: 'offline' 
        }))
        this.router.get('/auth/google/callback', this.callback);

        this.router.get('/login/naver', passport.authenticate('naver'));
        this.router.get('/auth/naver/callback', this.callback);

        this.router.get('/login/kakao', passport.authenticate('kakao'));
        this.router.get('/auth/kakao/callback', this.callback);
    }

    private callback(req: express.Request, res: express.Response) {
        const type = req.url.split('/')[2]
        passport.authenticate(type, function (err, user) {
            if (err || !user) { return res.redirect('http://localhost:3000'); }
            req.logIn(user, function (err) { 
                const tokenContent = { name: req.user!.displayName }
                const accessToken = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
                const token = new Token();
                token.setRefreshToken(req.user!.displayName, accessToken)

                res.cookie('token', accessToken);
                res.cookie('refreshToken', accessToken);
                res.redirect('http://localhost/home?token=' + accessToken);            
            });
        })(req, res);
    }
}

export default OauthController;
