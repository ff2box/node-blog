require('../db');
const friendService = require("../service/friendService");
const mongoose = require('mongoose');
require("../model/user");

async function testAddFriend() {
    let userId;
    userId = "5bb76b5b4e6b651dd49f18f0";    //1
    userId = "5bb796e9cf7f213a98c5ea58";    //4
    userId = "5bb796e415a113298013a824";    //3
    userId = "5bb76d0015fdea1900521b0d";    //2
    const res = await friendService.addFriend(userId);
    console.log(res);
}

async function testUdateFriend() {
    const userId = "5bb796e9cf7f213a98c5ea58";
    const attentionId = "5bb796e415a113298013a824";
    const res = await friendService.updateFriend(userId, attentionId);
    console.log(res);
}

async function testRemoveFriend() {
    const userId = "5bb76d0015fdea1900521b0d";
    const attentionId = "5bb76b5b4e6b651dd49f18f0";
    const res = await friendService.removeFriend(userId, attentionId);
    console.log(res);
}

async function testGetFriendById() {
    mongoose.model("userDetails", require("../model/userDetail"));
    // mongoose.model("users", require("../model/user"));

    const userId = "5bb796e9cf7f213a98c5ea58";
    const res = await friendService.getFriendById(userId);
    console.log(res);
}

// testAddFriend();

// testUdateFriend();
// testRemoveFriend();
testGetFriendById();