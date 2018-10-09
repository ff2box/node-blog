const Content = require("../model/content");

async function isContentExist(id) {
    const result = await Content.findOne({_id: id});
    return result;
}

async function addContent(body) {
    const res = await Content.create({body: body});
    return res;
}

async function getContentById(id) {
    // return await isContentExist(id);
    console.log("来查博客内容了？");
    const result = await Content.findOne({_id: id})
    // .populate({path: 'comments.sendId', select: 'username', model: 'users'})
    // .populate({path: 'comments.subComments.toId', select: 'username', model: 'users'})
    // .populate({path: 'comments.subComments.sendId', select: 'username', model: 'users'});
        .populate('comments.sendId', 'username')
        .populate('comments.subComments.toId', 'username')
        .populate('comments.subComments.sendId', 'username');

    // console.log(result[0].comments[1].sendId);
    // console.log(result[0].comments[1].subComments[0].sendId);
    // console.log(result[0].comments[1].subComments[0].toId);
    return result;
}

/*
 * 测试结果：ok
 */
async function getContentByIds(ids) {
    const result = await Content.find({_id: {$in: ids}});
    return result;
}

/**
 * 更新正文
 *
 * @param id
 * @param body
 * @returns {Promise<void>}
 */
async function updateContentById(id, body) {
    const res = await Content.updateOne({_id: id}, {body: body});
    if (res.n < 1) {
        throw Error("更新失败");
    }
    // return "更新成功"
}

async function deleteContentById(id) {
    const res = await Content.deleteOne({_id: id});
    if (res.n < 1) {
        throw Error("删除失败");
    }
}

/**
 * 更新评论
 * @param id
 * @param comment
 * @returns {Promise<void>}
 */
async function updateCommentById(id, comment) {
    //方式一：能通，但未全方位测试
    // await Content.findOne({_id: id}, function (err, bp) {
    //     if (err) {
    //         throw err;
    //     }
    //     const len = bp.comments.length;
    //     comment.index = len === 0 ? 1 : bp.comments[len - 1].index + 1;
    //     bp.comments.push(comment);
    //     bp.save(function (err) {
    //         if (err) {
    //             throw err;
    //         }
    //     });
    // });

    //方式二：
    // const content = await isContentExist(id);
    // if (!content) {
    //     throw Error(`id为 ${id} 的博客内容不存在！`);
    // }
    // // const lastComment = content.comments[content.comments.length - 1];
    // const len = content.comments.length;
    // comment.index = len || content.comments[len - 1].index + 1;
    // // if (len === 0) {
    // //     comment.index = 1;
    // // } else {
    // //     comment.index = content.comments[len - 1].index + 1;
    // // }
    // content.comments.push(comment);
    //
    // const result = await Content.updateOne({_id: id}, {comments: content.comments});
    // if (result.n < 1) {
    //     throw Error("更新评论失败！");
    // }

    //方式三：前面两种方式，都可以不用了
    const upadte = {
        $addToSet: {'comments': comment},
        // $set: {'comments.$.title': crazy}
    };
    const result = await Content.updateOne({_id: id}, upadte);
    console.log(result);
    if (result.n < 1) {
        throw Error("更新评论失败！");
    }
}

/**
 * 更新sub 评论
 * @param id
 * @param subComment
 * @returns {Promise<void>}
 */
async function updateSubCommentById(id, commentId, subComment) {
    /*
    仍然查出来的是content 对象
    [ { _id: 5bb7794b232dec02780c24e8,
    body: 'uint 和 int 分别是 uint256 和 int256 的别名。 运算符： 比较运算符： <= ， < ， == ， != ， >= ， > （返回布尔值） 位运算符： & ， | ， ^ （异或）， ~ （位取反） 算数运算符： + ， - ， 一元运算 - ， 一元运算 + ， * ， / ， % （取余） ， ** （幂）， << （左移位） ， >> （右移位） 除法总是会截断的（仅被编译为 EVM 中的 DIV 操作码）， 但如果操作数都是 字面常数（literals） （或者字面常数表达式），则不会截断。 除以零或者模零运算都会引发运行时异常。 移位运算的结果取决于运算符左边的类型。 表达式 x << y 与 x * 2**y 是等价的， x >> y 与 x / 2**y 是等价的。这意味对一个负数进行移位会导致其符号消失。 按负数位移动会引发运行时异常。 警告 由有符号整数类型负值右移所产生的结果跟其它语言中所产生的结果是不同的。 在 Solidity 中，右移和除是等价的，因此对一个负数进行右移操作会导致向 0 的取整（截断）。 而在其它语言中， 对负数进行右移类似于（向负无穷）取整。',
    comments: [ [Object], [Object], [Object] ],
    __v: 0 } ]
     */
    // const res = await Content.find({_id: id, "comments._id": commentId});
    // console.log(res);

    //官方文档的写法，正确：model.update.test.js
    const upadte = {
        $addToSet: {'comments.$.subComments': subComment},
        // $set: {'comments.$.title': crazy}
    };
    const result = await Content.updateOne({_id: id, "comments._id": commentId}, upadte);
    console.log(result);
    if (result.n < 1) {
        throw Error("更新子评论失败！");
    }
}

async function changeCommentById(id, commentId, comment) {
    const upadte = {
        $set: {'comments.$.commentBody': comment.commentBody, 'comments.$.sendId': comment.sendId},
        // $set: {'comments.$.title': crazy}
    };
    const result = await Content.updateOne({_id: id, "comments._id": commentId}, upadte);
    console.log(result);
    if (result.n < 1) {
        throw Error("change评论失败！");
    }
}

module.exports = {
    addContent,
    getContentById,
    getContentByIds,
    updateContentById,
    deleteContentById,

    updateCommentById,
    updateSubCommentById,
    changeCommentById,
};