var express = require('express');
var router = express.Router();
var User3 = require('../models/user');
var passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', (req, res, next) => {
    if (!req.body.email) {
        res.status(500).json({
            Success: 'false',
            Message: 'Email can not be blank',
        })
    }

    if (!req.body.username) {
        res.status(500).json({
            Success: 'false',
            Message: 'Username can not be blank',
        })
    }
    if (!req.body.password) {
        res.status(500).json({
            Success: 'false',
            Message: 'Email can not be blank',
        })
    }
    if (!req.body.cpass) {
        res.status(500).json({
            Success: 'false',
            Message: 'Re-password can not be blank',
        })
    }
    if (req.body.password != req.body.cpass) {
        res.status(500).json({
            Success: 'false',
            Message: 'Password and RePassword not match',
        })
    }
    const email = req.body.email.toLowerCase();
    User3.find({
        email: email,
    }, (err, docs) => {
        if (err) {
            res.status(500).json({
                Success: 'false',
                Message: 'Server Error',
                Error: err,
            })
        }
        else if (docs.length > 0) {
            res.status(500).json({
                Success: 'false',
                Message: 'Email already exists',
            })
        }
        const newUser = new User3();

        newUser.email = req.body.email,
            newUser.username = req.body.username,
            newUser.password = newUser.generateHash(req.body.password);
        newUser.save()
            .then(result => {
                res.status(201).json({
                    Success: 'true',
                    Message: 'User Created successfully',
                    User: {
                        email: result.email,
                        username: result.username,
                        password: result.password,
                    }
                    ,
                    request: {
                        METHOD: 'POST',
                        URL: 'http://localhost:3001/users/register',
                    }
                })
            })
            .catch(err => {
                res.status(500).json({
                    Success: 'false',
                    Message: 'Error Server',
                    Error: err,
                })
            })

    })
});
router.post('/login1', (req, res, next) => {
    console.log(req.body);
    User3.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    Message: 'Email not found, User not exits',
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        Message: 'Auth failed',
                    })
                }
                if (result) {
                    const token = jwt.sign({ data: user[0] }, 'secret', {
                        expiresIn: 604800 // 1 week
                    });
                    console.log('token', token);
                    return res.json({ user : user[0], token });
                }
                res.status(401).json({
                    Message: 'Auth failed....',
                });
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
});
router.post('/signin', passport.authenticate('local',{session : false}) ,(req,res,next)=>{
    console.log(req.user);
    const token = jwt.sign({ data: req.user }, 'secret', {
        expiresIn: 604800 // 1 week
    });
    res.status(200).json({
       token, 
       success : true,
       user : req.user,

    })
});
router.get("/secret", passport.authenticate('jwt', { session: false }),(req,res,next)=>{
    res.status(200).json({
        user : req.user,
    })
}) ;
  

module.exports = router;
