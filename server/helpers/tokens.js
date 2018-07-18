const jwt = require('jsonwebtoken');

const create = (user) => {
    return new Promise((resolve,reject) => {
        jwt.sign(user, process.env.JWT_TOKEN_SECRET, {expiresIn:60 * 600}, function(err, token){
            if(err) {
                reject(err);
                console.error("Error Wtih jwt - ",err)
            } else {
                user.token = token;
                resolve(user);
            }
        });
    });
};

const verify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
            if(!err){
                if(decoded){
                    resolve(decoded)
                } else {
                    resolve(false)
                }
            } else {
                reject(err);
            }
        });
    });
};

module.exports = {
    create,
    verify
}