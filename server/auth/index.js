const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const router = express.Router();

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

router.post('/signup', (req, res, next) => {
    const validResult = Joi.validate(req.body, signupSchema);
    if(validResult.error === null) {
        users.findOne({email:validResult.value.email}, 'email').then((user)=>{
            if(user === null) {
                //\\//\\//\\//hash passwrod here & add user to db here.//||//\\//\\//\\
                bcrypt.genSalt(13, function(err, salt) {
                    if(!err){
                        bcrypt.hash(validResult.value.password, salt, function(errr, hash) {
                            if(!errr){
                               // Store hash in your password DB.
                                users.insert({email:validResult.value.email.trim(), password:hash}).then((insertedUser) => {
                                    delete insertedUser.password;
                                    res.json(insertedUser);
                                }).catch((err) => {
                                    res.status(500);
                                    next(err);
                                });
                               //  respond to client with success
                            } else {
                                res.status(500);
                                next(err);
                            }
                        });
                    } else {
                        res.status(500);
                        next(err);
                    }
                });
            } else {
                const err = new Error("User Already Exists");
                res.status(400);
                next(err);
            }      
        }).catch((err) => {
            res.status(500)
            next(err);
        });
    } else {
        res.status(400);
        next(validResult.error);
    }
});

module.exports = router;