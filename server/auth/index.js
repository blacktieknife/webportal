const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const router = express.Router();

const tokens = require('../helpers/tokens.js');
const encrypt = require('../helpers/encrypt.js');
const verifyToken = require('../middleware/verifyToken.js');

const db = require('../db/connection.js');
const users = db.get('users');
users.createIndex('email', { unique: true });
//any route in this file is prepended with /auth..

//joi validation schema
const signupSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().trim().min(5).max(30).required(),
});

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
                const newUser = await users.findOneAndUpdate({email: tokenUser.email}, {$set:{token:tokenUser.token}});
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
        console.error(validResult.error);
        next(new Error("form validation failed."));
    }
});

router.post('/login', async (req, res, next) => {
    const validResult = Joi.validate(req.body, signupSchema);
    if(validResult.error === null) {
        try {
            const {email, password} = validResult.value;
            const user = await users.findOne({email:email});
            if(user !== null) {
               const isMatch = await encrypt.compareHash(password, user.password)
                    if(isMatch) {
                        const tokenUser = await tokens.create(user);
                        const newUser = await users.findOneAndUpdate({email: tokenUser.email},  {$set:{token:tokenUser.token}});
                        delete newUser.password;
                        res.json(newUser);
                    } else {
                        res.status(401);
                        next(new Error("Unable to login"))
                    }
               
            } else {
                res.status(400);
                console.log()
                next(new Error("Unable to login"));
            }
        } catch(err) {

        }
        
    } else {
        res.status(400);
        next(new Error("Unable to validate user"));
    }
});

router.post('/verifyToken', verifyToken, async (req, res, next) => {
    try {
        const validToken = await tokens.verify(req.token);
        if(validToken){
            res.json({user:validToken});
        } else {
            res.status(403);
            next(new Error('Could not validate user'));
        }
    } catch(err) {
        if(err.message.includes('invalid')){
            res.status(403);
            next(new Error("forbidden"));
        } else {
            res.status(500);
            next(new Error('Server Error'));
            console.error(err);
        }
    }
});


module.exports = router;