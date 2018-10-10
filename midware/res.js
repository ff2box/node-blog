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
    res.failure = (msg, code = -1) => {
        res.send({
            code: code,
            msg: msg
        });
    };
    next();
};