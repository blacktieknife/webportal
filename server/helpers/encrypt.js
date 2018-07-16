const bcrypt = require('bcryptjs');

const hashPass = (passwordString) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(13, function(err, salt) {
            if(!err){
                bcrypt.hash(passwordString, salt, function(errr, hash) {
                    if(!errr){
                        resolve(hash);
                    } else {
                        reject(new Error("Server Error"));
                    }
                });
            } else {
                reject(new Error("Server Error"));
            }
        });
    });
};

const compareHash = (passString, hashedPass) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passString, hashedPass, function(err, passwordMatch) {
            if(!err) {
                if(passwordMatch === true) {
                   resolve(true);
                } else {
                  resolve(false);
                }
            } else {
               reject(err)
            }
        });
    });
};

module.exports = {
    hashPass,
    compareHash
}