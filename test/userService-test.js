require('../db');
const userService = require("../service/userService");

async function testRegister() {
    let user = {
        username: "xbb5",
        password: "123456",
        role: 1000,
        phonenumber: "17711433527"
    };
    const res = await userService.register(user);
    console.log(res);
}

async function testGetUserInfo() {
    const res = await userService.getUserInfo("xbb");
    console.log(res);
}

async function testLogin() {
    let user = {
        username: "xbb",
        password: "123456",
    };
    const token = await userService.login(user);
    console.log(token); //865fd2d3c82b407f096965b7daa2eb3d0ad8cb8cc9e8e41dc8eba93c720e6185ae31c8b98bb16c2c6ea7ca1e97bcda3c
}

async function testDeleteUser() {
    const res = await userService.deleteUser("");
    console.log(res);   //删除没有返回
}

testRegister();
// testGetUserInfo();
// testLogin();
// testDeleteUser();
