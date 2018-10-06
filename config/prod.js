module.exports = {
    PORT: 80,
    //生产环境要配置用户名、密码
    DB: "blog-manager",
    SALT: "!@#~$%^",
    //token有效期，7天
    TokenExpire: 1000 * 3600 * 24 * 7,
    TokenKey: "TokenKey-test)(*&^%$#@!~",
    ContentDescLength: 70,
    ExcludeUrls: [
        /.*\/user\/login/,
        /.*\/user\/register/,
        /.*\/index/,
    ],
    PageCount: 15,
    Omit: "......",
};