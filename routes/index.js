var express = require('express');
var router = express.Router();
const { hashing, hashCompare, createJWT, authentication } = require("../lib/auth");
const date = new Date();
const {roleCheck}=require('../lib/middleWare');
const { mongodb, db_url, mongoClient,getCollection } = require("../dbConfig");

/* GET home page. */
router.get('/', roleCheck,async function (req, res, next) {
  const { email } = req.body;
  const { collection, client } = await getCollection("password");
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
      const token = await createJWT({ email });
      await collection.insertOne({ email: email, password: hash,created_at:date,role:{free:true,premium:false},verified:false });
      res.send({
        message: "User registered successfully",
        token
      });
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
    if (user) {
      const hash = await hashCompare(password, user.password);
      if (hash) {
        const token = await createJWT({ email });
        res.send({
          message: "Logging In",
          token
        });
      }
      else {
        res.send("Incorrect email ID or password");
      }
    }
    else {
      res.send("User doesn't exist. sign up to join");
    }
  }
  catch (err) {
    res.send(err);
  }
})

router.post("/verify-token/:token", async (req, res) => {
  const { collection, client } = await getCollection("password");
  try {
    console.log(req.params.token)
    const {active,email} = authentication(req.params.token);
    if (active) {
      await collection.updateOne({ email }, { $set: { verified: true } });
      res.status(200).send({
        message:"User verified successfully"
      })
    }
    else {
      res.status(401).send({
        message:"Token expired"
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      message:error
    })
  }
})

router.put("/updaterole", async (req, res) => {
  const { collection, client } = await getCollection("password");
  try {
    let document = await collection.findOne({ email: req.body.email });
    if (document) {
      await collection.updateOne({ email: req.body.email }, { $set: { role: { premium: true, free: false } } });  
      res.status(200).send("Roles updated");
    }
    else {
      res.status(200).send("user doesn't exist");
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
  finally {
    client.close();
  }
})

module.exports = router;
