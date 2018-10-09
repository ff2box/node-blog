const User = require("../model/user");
const mycrypto = require("../util/mycrypto");
const config = require("../config");

async function isUserExist(user) {
    user.password = mycrypto.sha1Hmac(user.password, user.username + config.SALT);
    const result = await User.findOne({username: user.username, password: user.password});
    if (!result) {
        throw Error("用户名或密码错误。");
    }
    return result;
}

async function isUsernameExist(username) {
    const result = await User.findOne({username: username}).select("-__v -password");
    // if (!result) {
    //     throw Error(`用户 ${username} 不存在。`);
    // }
    return result;
}

async function register(user) {
    const res = await isUsernameExist(user.username);
    if (res) {
        throw Error(`用户 ${user.username} 已存在！`);
    }
    //对密码进行加密存储，使用用户名作为salt
    user.password = mycrypto.sha1Hmac(user.password, user.username + config.SALT);
    user.role = 0;  //普通用户注册，都将role置为0
    user.created = Date.now();
    user.phonenumber = "158";

    const result = await User.create(user);
    result.password = "";

    //添加其他的两个表中的数据：userDetails、friends
    await afterRegister(result._id);

    return result;
}

async function getUserInfo(username) {
    const result = await isUsernameExist(username);
    if (!result) {
        throw Error(`用户 ${username} 不存在。`);
    }
    return result;
}

async function login(user) {
    await isUserExist(user);
    //响应token，aes算法
    const tokenData = {
        username: user.username,
        expire: Date.now() + config.TokenExpire
    };
    const token = mycrypto.aesEncrypt(JSON.stringify(tokenData), config.TokenKey);
    // console.log(`userService token : ${token}`);
    return token;
}

// async function logout() {
//
// }
/**
 * 已经验证token，所以可以直接通过username删除用户
 * @param username
 * @returns {Promise<string>}
 */
async function deleteUser(username) {
    const res = await isUsernameExist(username);
    if (!res) {
        throw Error(`用户 ${username} 不存在。`);
    }
    // {n:1,mModify:1,ok:1}
    const result = await User.deleteOne({username: username});
    if (result.n < 1) {
        throw Error("删除失败");
    }

    await afterDeleteUser(res._id);

    return `用户 ${username} 删除成功。`;
}

const friendService = require("../service/friendService");
const userDetailService = require("../service/userDetailService");

async function afterRegister(userId) {
    let res = await friendService.addFriend(userId);
    if (!res) {
        throw Error("预添加用户好友数据失败。");
    }
    res = await userDetailService.addUserDetail(userId);
    if (!res) {
        throw Error("预添加用户详情数据失败。");
    }
}

async function afterDeleteUser(userId) {
    await friendService.deleteFriend(userId);
    await userDetailService.deleteUserDetail(userId);
}

// async function getUsersByPage(page = 0) {
//     const result = await User.find().skip(page * config.PageCount).limit(config.PageCount)
//         .select("-__v");
//     return result;
// }

//TODO
async function getUsernameByid(id){
    const username = await User.findOne({_id:id},'username').select("-_id");
    if (!username) {
        throw Error(`用户id ${id} 的用户名不存在。`);
    }
    return username;
}

module.exports = {
    register,
    getUserInfo,
    login,
    // logout,
    deleteUser,
    // getUsersByPage，
    getUsernameByid
};