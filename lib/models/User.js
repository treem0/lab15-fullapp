const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
},
{
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  } 
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 14);
});

schema.statics.authenticate = async function({ username, password }) {
  const user = await this.findOne({ username });
  if(!user){
    const err = new Error('Invalid Username/Password');
    err.status = 401;
    throw err;
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!validPassword){
    const err = new Error('Invalid Username/Password');
    err.status = 401;
    throw err;
  }
  return user;
};

schema.method.authToken = function() {
  return jwt.sign(this.JSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });  
};

module.exports = mongoose.model('User', schema);