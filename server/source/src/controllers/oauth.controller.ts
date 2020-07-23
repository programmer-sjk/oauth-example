import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'

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

    private callback(request: express.Request, response: express.Response) {
        const type = request.url.split('/')[2]
        passport.authenticate(type, function (err, user) {
            if (!user) { return response.redirect('http://localhost:3000'); }
            request.logIn(user, function (err) { 
                const tokenContent = { name: request.user!.displayName }
                const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
                response.redirect('http://localhost/home?token=' + token);            
            });
        })(request, response);
    }
}

export default OauthController;
