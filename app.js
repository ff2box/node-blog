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

/*
localhost/wx?signature=a&echostr=b&timestamp=c&nonce=d
获取查询参数的方式是req.query

路径是localhost/wx/param1/param2/param3/param4，后面是否带查询参数都可以
localhost/wx/a/b/c/d
获取参数的方式是req.params

对于post请求
获取参数的方式是req.body
 */
//注册路由
// app.use("/", require("./router/indexRouter"));
app.use("/index", require("./router/indexRouter"));
app.use("/user", require("./router/userRouter"));
app.use("/blog", require("./router/blogRouter"));
app.use("/content", require("./router/contentRouter"));
app.use("/friend", require("./router/friendRouter"));
app.use("/userDetail", require("./router/userDetailRouter"));

//全局异常处理
app.use((err, req, res, next) => {
    res.failure(err.toString());
    console.log(err.toString());
});

app.listen(config.PORT);