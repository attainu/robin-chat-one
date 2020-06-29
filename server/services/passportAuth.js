import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20/lib/strategy';
import FacebookStrategy from 'passport-facebook/lib/strategy';
import LocalStrategy from 'passport-local/lib/strategy';

import User from '../schemas/user';
import hash from '../utils/hash';
import { sendWelcomeEmail } from '../email/account'

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findOne({ id: userId }).then(user => {
        done(null, user);
    });
});

// Local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, 
(email, password, done) => {
    User.findOne({ email: email }, (err, info) => {
        if (err) { 
            return done(err); 
        }
        if (!info) { 
            return done(null, false, { message: 'Login failed!' }); 
        }
        if (!info.isVerified) {
            return done(null, false, { message: 'Please verify your email account!' });
        }
        return new Promise(async () => {
            if(await hash.comparePassword(password, info.password)) {
                return done(null, info, { message: 'Login successful!'});
            } else {
                return done(null, false, { message: 'Login failed!' });
            }
        });        
    });
}));

// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/users/login/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }).then(existingUser => {
        if(existingUser) {
            return new Promise(async () => {
                if(await hash.comparePassword(profile._json.sub, existingUser.password)) {
                    return done(null, existingUser);
                } else {
                    return done(null, false);
                }
            });        
        }
        return new Promise(async () => {
            const user = {
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                email: profile._json.email,
                password: await hash.hashPassword(profile._json.sub),
                isVerified: true
            }

            User.create(user).then(user => {
                sendWelcomeEmail(user.email, user.firstname);
                return done(null, user);
            });
        });
    });

}));

// Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.DOMAIN_NAME}/users/login/facebook/callback`,
    profileFields: ['name', 'emails']
},
(accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile._json.email }).then(existingUser => {
        if(existingUser) {
            return new Promise(async () => {
                if(await hash.comparePassword(profile._json.id, existingUser.password)) {
                    return done(null, existingUser);
                } else {
                    return done(null, false);
                }
            });        
        }

        return new Promise(async () => {
            const user = {
                firstname: profile._json.first_name,
                lastname: profile._json.last_name,
                email: profile._json.email,
                password: await hash.hashPassword(profile._json.id),
                isVerified: true
            }
    
            User.create(user).then(user => {
                sendWelcomeEmail(user.email, user.firstname);
                return done(null, user);
            });
        });        
    });
}));