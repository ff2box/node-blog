const mongoose = require('mongoose');
const UserDetail = mongoose.model("userDetails", require("../model/userDetail"));

/**
 * 在创建用户的时候，就应该顺带添加该数据
 *
 * @param userid
 * @returns {Promise<*>}
 */
async function addUserDetail(userId) {
    const result = await UserDetail.create({_id: userId});
    return result;
}

async function deleteUserDetail(userId) {
    const result = await UserDetail.deleteOne({_id: userId});
    if (result.n < 1) {
        throw Error("删除用户关注数据失败");
    }
}

async function updateUserDetail(userId, detail) {
    const res = await getUserDetail(userId);
    res.attentionCount += detail.attentionCount;
    res.fanCount += detail.fanCount;
    res.blogCount += detail.blogCount;
    res.wordCount += detail.wordCount;
    res.getLikeCount += detail.getLikeCount;
    const result = await UserDetail.update({_id: userId}, res);
    if (result.n < 1) {
        throw Error("更新用户数据失败！");
    }
}

/**
 * friend 表的操作，影响detail
 * @param userId
 * @param attentionId
 * @param attention
 * @returns {Promise<void>}
 */
async function updateUserDetailByFriend(userId, attentionId, attention) {
    let detail = await UserDetail.findOne({_id: userId}, {attentionCount: 1});

    let update = {$set: {attentionCount: detail.attentionCount + attention}};
    let result = await UserDetail.update({_id: userId}, update);
    if (result.n < 1) {
        throw Error("更新用户数据失败！");
    }

    detail = await UserDetail.findOne({_id: attentionId}, {fanCount: 1});

    update = {$set: {fanCount: detail.fanCount + attention}};
    result = await UserDetail.update({_id: attentionId}, update);
    if (result.n < 1) {
        throw Error("更新用户数据失败！");
    }
}

/**
 * blog 表的操作，影响detail
 * @param userId
 * @param blogCount
 * @param wordCount
 * @param getLikeCount
 * @returns {Promise<void>}
 */
async function updateUserDetailByBlog(userId, blogCount, wordCount, getLikeCount) {
    const detail = await UserDetail.findOne({_id: userId}, {blogCount: 1, wordCount: 1, getLikeCount: 1});
    const update = {
        $set: {
            blogCount: detail.blogCount + blogCount,
            wordCount: detail.wordCount + wordCount,
            getLikeCount: detail.getLikeCount + getLikeCount
        }
    };
    const result = await UserDetail.update({_id: userId}, update);
    if (result.n < 1) {
        throw Error("更新用户数据失败！");
    }
}

async function getUserDetail(userId) {
    return UserDetail.findOne({_id: userId}).select("-__v");
}

module.exports = {
    addUserDetail,
    deleteUserDetail,

    updateUserDetail,
    updateUserDetailByFriend,
    updateUserDetailByBlog,
    getUserDetail
};