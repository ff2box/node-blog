/**
 * 注释的为新版本的连接
 * @type {*|(function(): MongoStore)}
 */
const mongoose = require('mongoose');
// const mongoose = require('connect-mongo')(connect);
const config = require('./config');

mongoose.connect(`mongodb://127.0.0.1/${config.DB}`,{useNewUrlParser: true});
const db = mongoose.connection;

db.on("error", err => {
    console.console.log("connection of mongodb err:" + err.toString());
});
db.once("open", () => {
    console.log("mongodb connect successfully!");
});