const { getCollection } = require("../dbConfig");

const roleCheck = async (req, res, next) => { 
    const {collection,client}=await getCollection("password");
    try {
        let document = await collection.findOne({ email: req.body.email });
        if (document) {
            if (document.role.premium) {
                next();
            }
            else {
                res.send("You are not a premium user");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
    finally {
        client.close();
    }
}

module.exports={roleCheck};