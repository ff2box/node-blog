const friendService = require("../service/friendService");
const router = require("express").Router();

router.post("/", async (req, res) => {
    const action = req.body.action;
    let result;
    switch (action) {
        case 1:
            await friendService.updateFriend(req.user._id, req.body.attentionId);
            result = "关注好友成功！";
            break;
        case 0:
            await friendService.removeFriend(req.user._id, req.body.attentionId);
            result = "取消关注好友成功！";
            break;
        default:
            // res.failure("错误操作！");
            throw Error("错误操作！");
    }
    res.success(result);
});

router.get("/", async (req, res) => {
    const result = await friendService.getFriendById(req.user._id);
    res.success(result);
});

module.exports = router;