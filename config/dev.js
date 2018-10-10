module.exports = {
    PORT: 8000,
    DB: "blog-manager-dev",
    SALT: "!@#~$%^",
    //token有效期，10分钟
    TokenExpire: 1000 * 3600 * 24 * 7,
    // TokenExpire: 1000,
    TokenKey: "TokenKey-prod)(*&^%$#@!~",
    ContentDescLength: 70,
    ExcludeUrls: [
        /.*\/user\/login/,
        /.*\/user\/register/,
        /.*\/index/,
    ],
    PageCount: 7,
    Omit: "......",
};