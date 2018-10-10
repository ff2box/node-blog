const Content = require("../model/content");
const mongoose = require('mongoose');

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
    const result = await Content.findOne({_id: id})
    // .populate({path: 'comments.sendId', select: 'username', model: 'users'})
    // .populate({path: 'comments.subComments.toId', select: 'username', model: 'users'})
    // .populate({path: 'comments.subComments.sendId', select: 'username', model: 'users'});
        .populate('comments.sendId', 'username')
        .populate('comments.subComments.toId', 'username')
        .populate('comments.subComments.sendId', 'username');

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
 * 添加评论
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
    const content = await isContentExist(id);
    if (!content) {
        throw Error(`id为 ${id} 的博客内容不存在！`);
    }
    const len = content.comments.length;
    //更新 楼数
    comment.index = len || content.comments[len - 1].index + 1;

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

/**
 * 更新评论
 * @param id
 * @param commentId
 * @param comment
 * @returns {Promise<void>}
 */
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

/**
 * 更新子评论：
 * 只有数组才能使用 push
 * 而这里是对象，使用set的话，会把整个subComment 对象，更新
 * @param id
 * @param commentId
 * @param subCommentId
 * @param subComment
 * @returns {Promise<void>}
 */
async function changeSubCommentById(id, commentId, subCommentId, sendId) {
    /*
    这样做是符合上面的绿色描述的，只是重复操作mongondb 报过期错误：
    DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
     */
    // const res = await Content.updateOne({
    //     _id: id
    // }, {
    //     $set: {
    //         "comments.$[i].subComments.$[j]": {
    //             sendId: sendId
    //         }
    //     }
    // }, {
    //     arrayFilters: [{
    //         // i: {$type:""}
    //         "i._id": {$eq: mongoose.Types.ObjectId(commentId)},
    //
    //     }, {
    //         "j._id": {$eq: mongoose.Types.ObjectId(subCommentId)}
    //     }]
    // });
    // return res;

    const res = await Content.updateOne({
        _id: id
    }, {
        $set: {
            "comments.$[i].subComments.$[j]": {
                sendId: sendId
            }
        }
    }, {
        arrayFilters: [{
            // i: {$type:""}
            "i._id": {$eq: mongoose.Types.ObjectId(commentId)},

        }, {
            "j._id": {$eq: mongoose.Types.ObjectId(subCommentId)}
        }]
    });
    return res;
}

/**
 * distinct：去重复，会返回所有的
 * demo：const res = await Content.distinct('comments.subComments.sendId');
 * ：数组字段
 * comments：数组内嵌文档
 *
 * 现在只能使用一个 $：Too many positional (i.e. ‘$’) elements found in path ‘translation.$.rating.$.rating’
 * https://pythonolyk.wordpress.com/2016/01/17/mongodb-update-nested-array-using-positional-operator/
 *
 * @param id
 * @param commentId
 * @param subCommentId
 * @returns {Promise<*>}
 */
async function findBySubCommentId(id, commentId, subCommentId) {
    let res;
//测试一：
    //  res = await Content.findOne({
    //         _id: id,
    //         "comments._id": commentId,
    //         "comments.subComments._id": subCommentId
    //     }, 'subComments'
    // );
    // 奇怪，只返回了content 的 id：{ _id: 5bb7794b232dec02780c24e8 }
//测试二：
    //  res = await Content.findOne({
    //         _id: id,
    //         "comments._id": commentId,
    //         "comments.subComments._id": subCommentId
    //     }, 'comments'
    // );
    // 返回了content 的 id，和 comments
//测试三：
    //  res = await Content.findOne({
    //         _id: id,
    //         "comments._id": commentId,
    //         "comments.subComments._id": subCommentId
    //     }, 'comments.subComments'
    // );
    // 正确返回，返回了content 的 id，subComments中值正确:
    // comments:
    //    [ { subComments: [] },
    //      { subComments: [Array] },
    //      { subComments: [] },
    //      { subComments: [] },
    //      { subComments: [] },
    //      { subComments: [] } ] }
//测试四：
    //  res = await Content.findOne({
    //         _id: id,
    //         "comments._id": commentId,
    //         "comments.subComments._id": subCommentId
    //     }, 'comments.subComments._id'
    // );
    //正确返回，所有的 comments.subComments._id
//测试五：
//     res = await Content.findOne({
//             _id: id,
//             "comments._id": commentId,
//             "comments.subComments._id": subCommentId
//         }, {"comments": {$elemMatch: {'subComments._id': subCommentId}}}
//         //{"userInfo":{$elemMatch{"userTag":"teach"}}}
//     );
    /*
    返回的是comments 对应的条目，包括subComments：
    { _id: 5bb7794b232dec02780c24e8,
  comments:
   [ { date: 2018-10-05T14:47:55.414Z,
       index: 2,
       approvalCount: 0,
       subComments: [Array],
       _id: 5bb7799b60e1960fa8b8e398,
       sendId: 5bb76d0015fdea1900521b0d,
       commentBody: '这是第 3 个评论内容哦~' } ] }
     */
//测试六：
    // const res = await Content.distinct('comments.subComments.se

    //测试七：
    // res = await Content.findOne({
    //         _id: id,
    //         // "comments._id": commentId,
    //         // "comments.subComments._id": subCommentId
    //     }, {"comments": {$elemMatch: {"subComments": {$elemMatch: {'toId': '5bb76d0015fdea1900521b0d'}}}}}
    //     //{"userInfo":{$elemMatch{"userTag":"teach"}}}
    // );
    //返回正确，但是有意义？

    //测试八：aggregate 方法
    res = await Content.aggregate([
        {
            // _id: id
            $match: {_id: mongoose.Types.ObjectId(id)}
        }, {
            $project: {
                _id: true,
                targetComment: {
                    $filter: {
                        // input: "$comments.$[i].subComments",
                        // input: "$comments.$[i].subComments.$[j]",
                        input: "$comments",
                        as: "comment",
                        cond: {
                            // $eq: [{$type: "$$comment.subComments"}, "array"]
                            // $not: {
                            $in: ["$$comment._id", [mongoose.Types.ObjectId(commentId)]]
                            // }
                        }
                    },
                }
            }
            /*
[ { _id: 5bb7794b232dec02780c24e8, targetComment: [ [Object] ] } ]
             */
        }, {
            $unwind: {
                path: "$targetComment",
                preserveNullAndEmptyArrays: false
            }

            /*
[ { _id: 5bb7794b232dec02780c24e8,
targetComment:
 { _id: 5bb7799b60e1960fa8b8e398,
   date: 2018-10-05T14:47:55.414Z,
   index: 2,
   approvalCount: 0,
   sendId: 5bb76d0015fdea1900521b0d,
   commentBody: '这是第 3 个评论内容哦~',
   subComments: [Array] } } ]
             */

        }, {
            $project: {
                _id: false,
                targetSubComment: {
                    $filter: {
                        input: "$targetComment.subComments",
                        as: "subComment",
                        cond: {
                            // "$subComment._id": {$eq: mongoose.Types.ObjectId(subCommentId)}
                            // $not: {
                            $in: ["$$subComment._id", [mongoose.Types.ObjectId(subCommentId)]]
                            // }
                        }
                    },
                }
            }
            /*
[ { targetSubComment: [ [Object] ] } ]
             */

        }, {
            $unwind: {
                path: "$targetSubComment",
                preserveNullAndEmptyArrays: false
            }
            /*
[ { targetSubComment:
 { _id: 5bbc584869405b0a70ddb584,
   date: 2018-10-09T07:26:11.433Z,
   toId: 5bb76d0015fdea1900521b0d,
   subCommentBody: '<script>\......' } } ]
             */

        }, {
            $project: {
                toId: "$targetSubComment.toId"
            }
            /*
[ { toId: 5bb76d0015fdea1900521b0d } ]
             */

            // }, {
            //     $out: "$targetSubComment"
        }
    ]);


    return res;
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
    changeSubCommentById,
    findBySubCommentId,
};