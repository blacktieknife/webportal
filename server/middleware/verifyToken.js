const  verifyToken = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    console.log("Header token", bearerHeader)
    if(typeof bearerHeader !== 'undefined'){
        //split at space
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403);
        next(new Error('Forbidden from access'));
    }
};

module.exports = verifyToken;