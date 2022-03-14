const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const db_name = "auth";
const db_url = "mongodb+srv://sathishkumar:sathish25@cluster0.mkek8.mongodb.net/" + db_name;


const getCollection = async (collectionName) => { 
    const client = await mongoClient.connect(db_url);
    const db = await client.db("nodemongoconnect");
    const collection =await db.collection(collectionName);
    return { collection:collection, client:client };
}
module.exports={mongodb,mongoClient,db_url,db_name,getCollection};

