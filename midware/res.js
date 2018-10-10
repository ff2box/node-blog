/**
 * res中间件
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    res.success = (data) => {
        res.send({
            code: 0,
            data: data,
            msg: "success!"
        });
    };
    // res.failure = (msg, code = -1) => {
    //     res.send({
    //         code: code,
    //         msg: msg
    //     });
    // };
    res.failure = (err) => {
        let code;
        let mMsg;
        switch (err.message) {
            case "1":
                code = 1000;
                mMsg = "非法请求，token缺失";
                break;
            case "2":
                code = 1001;
                mMsg = `token 不合法，${err.toString()}`;   //TODO
                break;
            case "3":
                code = 1002;
                mMsg = "token 已过期，请重新登录";
                break;
            default:
                code = -1;
                mMsg = err.toString();
                break;
        }
        res.send({
            code: code,
            msg: mMsg
        });
    };
    next();
};