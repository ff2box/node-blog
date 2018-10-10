'use strict';
const Friend = require("../model/friend");

/**
 * 在创建用户的时候，就应该顺带添加该数据
 *
 * @param userid
 * @returns {Promise<*>}
 */
async function addFriend(userId) {
    const result = await Friend.create({_id: userId});
    return result;
}

async function deleteFriend(userId) {
    const result = await Friend.deleteOne({_id: userId});
    if (result.n < 1) {
        throw Error("删除用户详情数据失败");
    }
}

async function updateFriend(userId, attentionId) {
    if (userId === attentionId) {
        throw Error("不能关注自己！");
    }
    let update = {
        $addToSet: {"attentions": attentionId}
    };
    let result = await Friend.updateOne({_id: userId}, update);
    if (result.n < 1) {
        throw Error("关注失败！");
    }
    update = {
        $addToSet: {"fans": userId}
    };
    result = await Friend.updateOne({_id: attentionId}, update);
    if (result.n < 1) {
        throw Error("关注失败！");
    }

    await afterUpdateFriend(userId, attentionId, 1);
}

/**
 * 取消关注
 * @param userId
 * @param attentionId
 * @returns {Promise<void>}
 */
async function removeFriend(userId, attentionId) {
    if (userId === attentionId) {
        throw Error("错误操作！");
    }
    let update = {
        $pull: {"attentions": attentionId}
    };
    let result = await Friend.updateOne({_id: userId}, update);
    if (result.n < 1) {
        throw Error("取消关注失败！");
    }
    update = {
        $pull: {"fans": userId}
    };
    result = await Friend.updateOne({_id: attentionId}, update);
    if (result.n < 1) {
        throw Error("取消关注失败！");
    }

    await afterUpdateFriend(userId, attentionId, -1);
}

async function getFriendById(userId) {
    // .populate({path: 'comments.subComments.sendId', select: 'username', model: 'users'});
    return Friend.findOne({_id: userId}).populate("attentions fans")
        // .populate({path: 'attentions.$._id', select: "username", model: 'users'}).select("-__v");
}

const userDetailService = require("../service/userDetailService");

async function afterUpdateFriend(userId, attentionId, attention) {
    await userDetailService.updateUserDetailByFriend(userId, attentionId, attention);
}

// async function afterRemoveFriend() {
//
// }

module.exports = {
    addFriend,
    deleteFriend,

    updateFriend,
    removeFriend,
    getFriendById
};
