require('./db');
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config");
const app = express();

//注册中间件
app.use(require("./midware/res"));
app.use(require("./midware/permission"));
app.use(require("./midware/token"));
app.use(morgan('combined'));
app.use(bodyParser.json());

//注册路由
app.use("/index", require("./router/indexRouter"));
app.use("/user", require("./router/userRouter"));
app.use("/blog", require("./router/blogRouter"));
app.use("/content", require("./router/contentRouter"));
app.use("/friend", require("./router/friendRouter"));
app.use("/my", require("./router/userDetailRouter"));

//全局异常处理
app.use((err, req, res, next) => {
    res.failure(err.toString());
    console.log(err.toString());
});

app.listen(config.PORT);