const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Chatbot');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    chats: {
      type: [[String]], 
      default: [],
    }
})
module.exports = mongoose.model('User', userSchema);