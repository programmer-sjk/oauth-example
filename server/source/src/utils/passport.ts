import passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
import { config } from '../../config'

export const googleStrategy = new Strategy({
    clientID: config.google.client_ID,
    clientSecret: config.google.client_secret, 
    callbackURL: "http://localhost:3000/auth/google/callback"
}, callback)

export const naverStrategy = new NaverStrategy({
    clientID: config.naver.client_ID,
    clientSecret: config.naver.client_secret,
    callbackURL: "http://localhost:3000/auth/naver/callback"
}, callback)

export const kakaoStrategy = new KakaoStrategy({
    clientID: config.kakao.client_ID,
    callbackURL: "http://localhost:3000/auth/kakao/callback"
}, callback)

function callback(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile)
    return cb(undefined, profile);
}
