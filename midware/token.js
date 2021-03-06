const config = require("../config");
const mycrypto = require("../util/mycrypto");
const User = require("../service/userService");

/**
 * 判断当前用户是否是合法认证用户
 *
 * @param req
 * @param res
 * @param next
 */
function isExcludeUrl(url) {
    let isExclude = false;
    config.ExcludeUrls.forEach(item => {
        if (item.test(url)) {
            isExclude = true;
        }
    });
    // console.log("isExclude:" + isExclude);
    return isExclude;
}

module.exports = async (req, res, next) => {
    // console.log(req.url);
    if ('/favicon.ico' == req.url) {
        res.end("");
        return;
    }

    //判断是否需要token
    console.log(req.url);
    // console.log(req.get("token"));
    if (!isExcludeUrl(req.url)) {
        const token = req.get("token");
        if (!token) {
            // throw Error("非法请求，token缺失");
            // res.failure(1000, "非法请求，token缺失");
            throw Error("1");
        }
        let tokenData;
        try {
            tokenData = JSON.parse(mycrypto.aesDecrypt(token, config.TokenKey));
            // console.log(tokenData);
        } catch (e) {
            throw Error("2");
            // throw Error(`token 不合法，${e.toString()}`);
            // res.failure(1001, `token 不合法，${e.toString()}`);
        }
        //校验是否过期
        if (tokenData.expire < Date.now()) {
            // throw Error("token 已过期，请重新登录");
            // res.failure(1002, "token 已过期，请重新登录");
            throw Error("3");
        }
        const userInfo = await User.getUserInfo(tokenData.username);
        //req 对象安装用户信息，后续使用
        req.user = userInfo;
    }
    next();
};
