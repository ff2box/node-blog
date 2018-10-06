const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "用户id不能为空"],
        ref: 'users'
    },
    // bolgIcon:{   //文章icon
    //
    // },
    blogTitle: {
        type: String,
        required: [true, "博客标题不能缺少"]
    },
    blogContent: {
        type: String,
        require: [true, "博客内容不能缺少"],
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "内容id不能为空"],
        ref: 'contents' //关联查询：ref: '数据库名称'
                        //详见：https://cnodejs.org/topic/508834ee65e98a980983b3d2
    },
    contentDesc: { //blog内容缩略文字，description
        type: String,
        // maxlength: 70
    },
    contentSha256: {
        type: String,
        require: [true, "正文sha256值不能为空"]
    },
    blogSize: {
        type: Number,
        require: [true, "博客长度不能为空"],
        min: [3, "博客内容字数不能小于3"]
    },   //字数
    readOnlyMode: {    //是否只读模式
        type: Boolean,
        // required: [true, "是否只读不能为空"],
        default: false   //默认可以评论
    },
    copyrightNotice: {   //是否版权声明
        type: Boolean,
        // required: [true, "是否只读不能为空"],
        default: false   //默认无版权声明
    },
    commentsCount: { //评论数
        type: Number,
        default: 0
    },
    likeCount: { //喜欢数
        type: Number,
        default: 0
    },
    viewCount: { //浏览次数
        type: Number,
        default: 0
    },
    publicPermission: {  //浏览权限
        type: Number,
        // required: [true, "浏览权限不能为空"],
        default: 0   //0、所有人可浏览，1、仅关注者，2、仅自己
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    modifyDate: {
        type: Date,
        // default: Date.now()
    },
});

module.exports = mongoose.model("blogs", schema);