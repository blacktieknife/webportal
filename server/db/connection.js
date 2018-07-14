const monk = require('monk');
const db = monk('localhost/auth-test');


module.exports = db;