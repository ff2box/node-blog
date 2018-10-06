require('../db');
const userDetailService = require("../service/userDetailService");

async function testAddUserDetail() {
    let userId = "5bb76d0015fdea1900521b0d";
    userId = "5bb76b5b4e6b651dd49f18f0";    //1
    userId = "5bb796e415a113298013a824";    //3
    userId = "5bb796e9cf7f213a98c5ea58";    //4
    const res = await userDetailService.addUserDetail(userId);
    console.log(res);
}

async function testUpdateUserDetail() {
    const userId = "5bb76b5b4e6b651dd49f18f0";
    const detail = {
        "attentionCount": -11,
        "fanCount": 2,
        "blogCount": 3,
        "wordCount": 4,
        "getLikeCount": 5
    };
    const res = await userDetailService.updateUserDetail(userId, detail);
    console.log(res);
}

async function testGetUserDetail() {
    const userId = "5bb76b5b4e6b651dd49f18f0";
    const res = await userDetailService.getUserDetail(userId);
    console.log(res);
}

testAddUserDetail();
// testUpdateUserDetail();
// testGetUserDetail();