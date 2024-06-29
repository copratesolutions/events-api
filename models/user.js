const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({

  phoneNumber: {
    type: String,
    required: true,
  },

  bikeManufacturer: {
    type: String,
    default: "N/A"
  },

  batteryCapacity: {
    type: String,
    default: "N/A"
  },

  numberPlateValue: {
    type: String,
    default: "N/A"
  },

  otp: {
    type: String,
    default: ""
  },

});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      phoneNumber: this.phoneNumber,
      bikeManufacturer: this.bikeManufacturer,
      batteryCapacity: this.batteryCapacity,
      numberPlateValue: this.numberPlateValue
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    phoneNumber: Joi.string().min(12).max(13).required(),
  };

  return (result = Joi.validate(user, schema));
}

module.exports.User = User;
module.exports.validateUser = validateUser;
