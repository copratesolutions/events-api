const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config")

module.exports = function(){
 // connecting to mongodb.....
    const db = config.get("db");
 mongoose.connect(db)
 .then(() => winston.info(`Successfully Connected To ${ db } ...`))
 .catch(error => console.error("Could Not Connect to Mongodb .....",error.message));
}