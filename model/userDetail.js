const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDetail = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "回复用户id不能为空"],
        ref: 'users'
    },
    attentionCount: {   //可以从 friends 表获取
        type: Number,
        min: 0,
        default: 0
    },
    fanCount: {   //可以从 friends 表获取
        type: Number,
        min: 0,
        default: 0
    },
    blogCount: {   //可以从 blog 表计算
        type: Number,
        min: 0,
        default: 0
    },
    wordCount: {   //可以从 blog 表计算
        type: Number,
        min: 0,
        default: 0
    },
    getLikeCount: {   //可以从 blog 表计算
        type: Number,
        min: 0,
        default: 0
    }
});
// mongoose.model("userdetail", UserDetail);

module.exports = UserDetail;