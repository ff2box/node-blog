const friendService = require("../service/friendService");
const router = require("express").Router();

router.put("/", async (req, res) => {
    const action = req.body.friendAction;
    let result;
    switch (action) {
        case 0:
            await friendService.updateFriend(req.user._id, req.body.attentionId);
            result = "关注好友成功！";
            break;
        case 1:
            await friendService.removeFriend(req.user._id, req.body.attentionId);
            result = "关注好友成功！";
            break;
        default:
            res.failure("错误操作！");
    }
    res.success(result);
});

router.get("/", async (req, res) => {
    const result = await friendService.getFriendById(req.user._id);
    res.success(result);
});

module.exports = router;