import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'

class OauthController {
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }))
        this.router.get('/auth/google/callback', this.callback);

        this.router.get('/login/naver', passport.authenticate('naver', { failureRedirect: '#!/auth/login' }));
        this.router.get('/auth/naver/callback', this.callback);

        this.router.get('/login/kakao', passport.authenticate('kakao'));
        this.router.get('/auth/kakao/callback', this.callback);
    }

    private callback(req, res, next) {
        const type = req.url.split('/')[2]
        passport.authenticate(type, function (err, user) {
            if (!user) { return res.redirect('http://localhost:3000'); }
            req.logIn(user, function (err) { 
                const tokenContent = { name: req.user!.displayName }
                const token = jwt.sign(tokenContent, 'secret', { expiresIn: 30 });
                res.redirect('http://localhost/home?token=' + token);            
            });
        })(req, res);
    }
}

export default OauthController;
