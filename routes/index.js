var express = require('express');
var router = express.Router();
const { hashing, hashCompare } = require("../lib/auth");
const { mongodb, db_url, mongoClient,getCollection } = require("../dbConfig");

/* GET home page. */
router.get('/',async function (req, res, next) {
  const { collection, client } = await getCollection("users");
  try {
    let document = await collection.find().toArray();
    res.send(document);
  }
  catch (err) {
    console.log(err)
    res.send(err);
  }
  finally {
    client.close()
  }
});

router.post("/register", async (req, res) => {
  const { collection, client } = await getCollection("password");
  try {
    const { email,password } = req.body;
    const hash = await hashing(password);
    console.log(hash);
    let user = await collection.findOne({ email: email });
    if (user) {  
      res.send("user already exists");
    }
    else {
      await collection.insertOne({ email: email, password: hash });
      res.send("User registered successfully");
    }
    
  }
  catch (err) {
    res.send(err);
  }
  
})

router.post('/login', async (req, res) => {
  const { collection, client } = await getCollection("password");
  try {
    const { email,password } = req.body;
    let user = await collection.findOne({ email: email });
    console.log(user)
    if (user) {
      const hash = await hashCompare(password, user.password);
      if (hash) {
        res.send("Logging In");
      }
      else {
        res.send("Incorrect email ID or password");
      }
    }
    else {
      res.send("User doesn't exist. sign up to join");
    }
    
    // res.send(hash);
  }
  catch (err) {
    res.send(err);
  }
})

module.exports = router;
