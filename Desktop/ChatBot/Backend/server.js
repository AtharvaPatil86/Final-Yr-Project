const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
const jwt = require('jsonwebtoken');
const userModel = require('./User');
const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../vite-project/dist')));
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);


app.post('/query', async (req, res)=>{
  res.render();
 
});
app.post('/register', async(req, res)=>{
  let {name, email, username, password} = req.body;
  let user = await userModel.findOne({email});
  if(user) res.status(500).send('User already exists');
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt, async(err, hash)=>{
      const user = await userModel.create({
        name,
        email,
        username,
        password: hash
      })
      let token = jwt.sign({email:email, userid: user._id}, "secretkey");
      res.cookie("token", token);
      res.redirect('/');
    })
  })
})

app.post('/login', async(req, res)=>{
 let {username, password} = req.body;
 let user = await userModel.findOne({username});
 if(!user) res.send("Something went wrong");
 bcrypt.compare(password, user.password, (err, result)=>{
  if(result){
    let token = jwt.sign({username: username, userid: user._id}, "secretkey");
    res.cookie("token", token);
    res.json({
      success: true,
      message: "Login Successful",
      username: user.username,
    })
  }
  else res.status(401).json({success: false, message: "Invalid credentials"});
 })
});

app.get('/login', (req, res)=>{

})

app.get('/logout', (req, res)=>{
  res.cookie("token", "");
  res.status(200).json({success: true});
})

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../vite-project/dist/index.html'));
});

app.listen(5000);