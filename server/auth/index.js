const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const router = express.Router();

const encrypt = require('../helpers/encrypt.js');

const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('email', { unique: true });
//any route in this file is prepended with /auth..

//joi validation schema
const signupSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().trim().min(5).max(30).required(),
});
;

router.get('/', (req, res) => {
    res.json({
        message:"pancake is the now world"
    });
});

router.post('/signup', (req, res, next) => {
    const validResult = Joi.validate(req.body, signupSchema);
    if(validResult.error === null) {
        users.findOne({email:validResult.value.email}, 'email').then((user)=>{
            if(user === null) {
                //\\//\\//\\//hash passwrod here & add user to db here.//||//\\//\\//\\
                encrypt.hashPass(validResult.value.password).then((hash) => {
                    users.insert({email:validResult.value.email.trim(), password:hash}).then((user) => {
                        delete user.password;
                        jwt.sign(user, process.env.JWT_TOKEN_SECRET, {expiresIn:60 * 600}, function(err, token){
                            if(err) {
                                res.status(500);
                                next(new Error("Server Error"));
                                console.error("Error Wtih jwt - ",err)
                            } else {
                                console.log("TOKEN RECIEVED!!",token)
                                user.token = token;
                                res.json(user);
                            }
                        });
                    }).catch((err) => {
                        throw new Error(err)
                    });
                }).catch((err) => {
                    res.status(500)
                    next(new Error("Server Error"));
                });
            } else {
                const err = new Error("User Already Exists");
                res.status(400);
                next(err);
            }      
        }).catch((err) => {
            res.status(500)
            
            next(new Error("Server Error"));
        });
    } else {
        res.status(400);
        next(validResult.error);
    }
});

router.post('/login',(req, res, next) => {
    const validResult = Joi.validate(req.body, signupSchema);
    if(validResult.error === null) {
        const {email, password} = validResult.value;
        users.findOne({email:email}).then((user) => {
            if(user !== null) {
                encrypt.compareHash(password, user.password).then((isMatch) => {
                    if(isMatch) {
                        res.json({email:user.email, id:user._id})
                    } else {
                        res.status(401);
                        next(new Error("Unable to login"))
                    }
                }).catch((err) => {
                    res.status(500);
                    next(new Error("Server Error"))
                }); 
            } else {
                res.status(400);
                next(new Error("Unable to login"));
            }
        });
    } else {
        res.status(400);
        next(new Error("Unable to login"));
    }
});

module.exports = router;