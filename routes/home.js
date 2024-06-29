const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
res.send("<h1> Hello welcome to Lyanda  mobile application's user Service  api.. </h1>");
});

module.exports = router;

