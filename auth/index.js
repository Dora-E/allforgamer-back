const jwt = require("jsonwebtoken");
const secret = "@2018/_owlSimplonxwxw,HDnc)x:xzHey@";


// se dossier permet de verif data user de rmeove les data sensilble email et mdp 
// pour gerer la session qui est en cours 
//sans deconnecter user de la session est ai acces a toutes les page sans se deco
// sans refresh la session en cour
/**
 * @function
 * @module authenticate a middleware to use in express routes
 * @param {Object} req an express http request object
 * @param {String} req.header["x-authenticate"] the jwt token available in http request header
 * @param {Object} res an express http response object
 * @param {Function} next a function allowing to go back to initial express route callback
 * @return {undefined} RAS
 */
var authenticate = function authenticate(req, res, next) {
    try {
        // verifie data du user et si il est crypté
        const token = req.header("x-authenticate");
        jwt.verify(token, secret);
        req.isAuthenticated = token;
        next(); // si pas d'erreur,le prochain middleware est appellé...
    } catch (err) {
        res.status(401).send(err);
    }
};

/**
 * verify an http req to determine is user credntials are correct
 * @function
 * @param {String} token - A valid JSON WEB TOKEN (JWT)
 * @throws {Error} when the token is invalid
 * @returns {Object} the decoded token representing an user object
 */
const decodeToken = function decodeToken(token) {
    return jwt.decode(token);
};

/**
 * verify an http req to determine is user credntials are correct
 * @function
 * @param {Object} req - An express http request object
 * @returns {Boolean} true if user credentials are coreect, false otherwise
 */
const verifyToken = function verifyToken(token) {
    try {
        const check = jwt.verify(token, secret);
        return {
            msg: check,
            status: true
        };
    } catch (err) {
        return {
            msg: err.message,
            status: false
        };
    }
};

/**
 * verify an http req to determine is user credntials are correct
 * @function
 * @param {Object} req - An express http request object
 * @returns {Boolean} true if user credentials are coreect, false otherwise
 */
const createToken = function createToken(user, ip) {
    return jwt.sign({
            infos: user,
            ip,
        },
        secret
    );
};

/**
 * takes an user object as argument and returns a copy of it after deleting sensitive infos such as passord or mail
 * @function
 * @param {Object} u - A user object fetched from database
 * @returns {Object} filteredUser - the user minus sensitive values
 */
const removeSensitiveInfo = function removeSensitiveInfo(u) {
    if (!u) throw new Error("A User object is required as argument");
    const filteredUser = {};
    const keys = ["password", "mail"];

    for (let key in keys) {
        delete u[keys[key]];
    }

    for (let prop in u) {
        if (u.hasOwnProperty(prop)) filteredUser[prop] = u[prop];
    }

    return filteredUser;
};

module.exports = {
    authenticate,
    createToken,
    decodeToken,
    verifyToken,
    removeSensitiveInfo,
};