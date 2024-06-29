require("dotenv").config();
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  const platFormUsers = await User.find();
  res.send(platFormUsers);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

router.post("/", async (req, res) => {

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUserByEmail = await User.findOne({ email: req.body.email });

  if (existingUserByEmail) {

    const authenticationToken = existingUserByEmail.generateAuthToken();

    res.status(200).send(authenticationToken);

  } else {

    let platFormUser = new User(
      _.pick(req.body, ["email"])
    );

    const authenticationToken = platFormUser.generateAuthToken();

    res.status(200).send(authenticationToken);
  }

});


router.delete("/:id", async (req, res) => {
  const platFormUser = await User.findByIdAndRemove(req.params.id);
  res.send(platFormUser);
});

module.exports = router;


