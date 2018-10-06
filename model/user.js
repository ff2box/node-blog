const mongoose = require('mongoose');

const schema = mongoose.Schema({
    // userId: {},
    username: {
        type: String,
        unique: true,
        require: [true, "用户名不能为空"]
    },
    password: {
        type: String,
        require: [true, "密码不能为空"]
    },
    role: { //角色（权限控制）
        type: Number,
        default: 0  //0：普通商家用户，1：登录用户，99：超级管理员
    },
    created: {
        type: Date,
        default: Date.now()
    },
    // email: {
    //     type: String
    // },
    // icon: {
    //
    // },
    phonenumber: {
        type: String
    }
});
module.exports = mongoose.model("users", schema);