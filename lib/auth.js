const bcrypt = require('bcryptjs');
const JWT = require("jsonwebtoken");
const secret = "sathishiygkkmkb";
const JWTD = require("jwt-decode");
const { token } = require('morgan');

const hashing = async (value) => {
    try {
        const salt = await bcrypt.genSalt(10);
        console.log("salt",salt)
        const hash = await bcrypt.hash(value, salt);
        return hash;
    }
    catch (err) {
        return err;
    }
}

const hashCompare = async (password, hashValue) => {
    try {
        return await bcrypt.compare(password, hashValue);
    }
    catch (err) {
        return err;
    }
}

const createJWT = async ({ email }) => {
    return await JWT.sign({
        email
    }, secret, {
        expiresIn:"2m"
    })
}

const authentication = (token) => {
    const decode = JWTD(token);
    const currentTimeInMicroSec = Math.round(new Date() / 1000);
    if (currentTimeInMicroSec <= decode.exp) return {
        email: decode.email,
        active: true
    };
    else return {
        email: decode.email,
        active:false
    };
}
module.exports = { hashing, hashCompare,createJWT,authentication };