const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const path = require('path')
const jwt = require('jsonwebtoken');
const userModel = require('./user');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../vite-project/dist')));
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
      res.send("created");
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
    res.status(200).send("Login Successful");
  }
  else res.redirect('/login');
 })
})
app.get('/logout', (req, res)=>{
  res.cookie("token", "");
  res.redirect('/login');
})

app.listen(5000);