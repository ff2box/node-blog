const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "用户id不能为空"],
    },
    attentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDetails'
    }],
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDetails'
    }]
});

module.exports = mongoose.model("friends", schema);