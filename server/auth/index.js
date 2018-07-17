const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const router = express.Router();

const tokens = require('../helpers/tokens.js');
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

router.post('/signup', async (req, res, next) => {
    const validResult = Joi.validate(req.body, signupSchema);
    if(validResult.error === null) {
        try { 
            const user = await users.findOne({email:validResult.value.email}, 'email');
            if(user === null) {
                //\\//\\//\\//hash passwrod here & add user to db here.//||//\\//\\//\\
                const hash = await encrypt.hashPass(validResult.value.password);
                const insertedUser = await users.insert({email:validResult.value.email.trim(), password:hash});
                const tokenUser = await tokens.create(insertedUser);
                const newUser = await users.findOneAndUpdate({email: tokenUser.email}, tokenUser);
                delete newUser.password;
                const validToken = await tokens.verify(newUser.token);
                if(validToken){
                    res.json(newUser); 
                } else {
                    throw new Error("Could not validate token");
                }               
            } else {
                const err = new Error("User Already Exists");
                res.status(400);
                next(err);
            } 
        } catch(err) {
            res.status(500);
            next(new Error('Server Error'));
            console.error(err);
        }
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