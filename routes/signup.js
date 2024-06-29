require("dotenv").config();
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const subaccountSid = process.env.TWILIO_ACCOUNT_SUBACCOUNT_SID;
const twilioClient = require('twilio')(accountSid, authToken);
const otpGenerator = require('otp-generator');
const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});


router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

router.post("/", async (req, res) => {

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUserByphoneNumber = await User.findOne({ phoneNumber: req.body.phoneNumber });

  if (existingUserByphoneNumber) {

    const authenticationToken = existingUserByphoneNumber.generateAuthToken();

    res.status(200).send(authenticationToken);

  } else {

    let user = new User(
      _.pick(req.body, ["phoneNumber"])
    );

    const generatedOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    user.otp = generatedOtp;
   
    await user.save();

    twilioClient.messages.create({
      to: req.body.phoneNumber,
      from: subaccountSid,
      body: `Datfri-LyandaUg code:${generatedOtp}, use this otp to verify your number.`
    });

    res.send("An OTP code has been sent to your number.");
  }

});


router.post("/resend-otp", async (req, res) => {

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ phoneNumber: req.body.phoneNumber });

  const generatedNewOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

  user.otp = generatedNewOtp;

  await user.save();

  twilioClient.messages.create({
    to: req.body.phoneNumber,
    from: subaccountSid,
    body: `Datfri-LyandaUg code:${generatedNewOtp}, use this OTP to verify your number.`
  });

  res.send("An new OTP code has been sent to your number.");

});

router.get('/verify/:otp', async (req, res) => {

  const verificationOtp = req.params.otp;

  let platFormUser = await User.findOne({ otp: verificationOtp });

  if (!platFormUser) {
    return res.status(404).send('Invalid OTP code provided.');
  }

  platFormUser.otp = '';
  await platFormUser.save();

  const authenticationToken = platFormUser.generateAuthToken();

  res.status(200).send(authenticationToken);
});

router.patch("/:id", async (req, res) => {

  const platformUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  const updateToken = platformUser.generateAuthToken();

  res.status(200).send(updateToken);
});


router.delete("/:id", async (req, res) => {
  const platFormUser = await User.findByIdAndRemove(req.params.id);
  res.send(platFormUser);
});

module.exports = router;


