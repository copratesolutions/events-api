const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  userName: {
    type: String,
    default: "username"
  },

  userType: {
    type: String,
    default: 'standard'
  },

  contact: {
    type: String,
    default: "N/A",
  },

  address: {
    type: String,
    default: "N/A"
  },

  city: {
    type: String,
    default: "N/A"
  }

}, {
  timestamps: true
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      contact: this.contact,
      address: this.address,
      city: this.city
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
  };

  return (result = Joi.validate(user, schema));
}

module.exports.User = User;
module.exports.validateUser = validateUser;
