const bcrypt = require('bcryptjs');

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

module.exports = { hashing, hashCompare };