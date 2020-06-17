import passport, { session } from 'passport';
import GoogleStrategy from 'passport-google-oauth20/lib/strategy';
import FacebookStrategy from 'passport-facebook/lib/strategy';
import 'dotenv/config';

import User from '../schemas/user';
import hash from '../utils/hash';
import { promiseImpl } from 'ejs';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findOne({ id: userId }).then(user => {
        done(null, user);
    });
});

// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/users/login/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }).then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        }
        return new Promise(async(res,rej)=>{
        const user = {
            firstname: profile._json.given_name,
            lastname: profile._json.family_name,
            email: profile._json.email,
            password: await hash.hashPassword(profile._json.sub)
        }

        User.create(user).then(user => {
            return done(null, user);
        });
        })
    });

}));

// Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/users/login/facebook/callback"
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }).then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        }
        return new Promise(async(res,rej)=>{
        const user = {
            firstname: profile._json.given_name,
            lastname: profile._json.family_name,
            email: profile._json.email,
            password: await hash.hashPassword(profile._json.sub)
        }

        User.create(user).then(user => {
            return done(null, user);
        });
    })
    });
}));