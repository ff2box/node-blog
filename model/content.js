const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema();
const SubComment = new Schema();

//二级评论：sendId、toId、date、body
SubComment.add({
    sendId: {   //当前登录的用户
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "回复用户id不能为空"],
        ref: 'users'
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "被回复用户id不能为空"],
        ref: 'users'
    },
    date: {
        type: Date,
        index: true,
        default: Date.now()
    },
    subCommentBody: {
        type: String,
        require: [true, "评论内容不能为空"]
    }
});
//一级评论：sendId、date、index、approvalCount、body、subComments
Comment.add({
    sendId: {   //当前登录的用户
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "用户id不能为空"],
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    index: {
        type: Number,
        index: true,
        require: [true, "评论index不能为空"],
        default: 0
    },
    approvalCount: { //点赞数
        type: Number,
        default: 0
    },
    commentBody: {
        type: String,
        require: [true, "评论内容不能为空"]
    },
    subComments: [SubComment]
});

const Content = new Schema({
    //?
    // buf: {
    //     type: Buffer,
    // },
    body: {
        type: String,
        require: [true, "博客正文不能为空"]
    },
    // topComments: [Number],  //置顶的评论，此处记住评论的index
    comments: [Comment]
});

module.exports = mongoose.model("contents", Content);