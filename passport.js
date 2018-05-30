const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User3 = require('./models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'secret'
}, async (payload, done) => {
    User3.findById(payload.data._id,(err,user)=>{
        if(err){
            return done(err,false);
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    })
}));
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User3.findOne({ email });
        if (!user) {
            return done(null, false);
        };
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return done(null, false);
        }
        return done(null, user);
        console.log(user);
    } catch (error) {
        done(error, false);
    }
}));
