const userDetailService = require("../service/userDetailService");
const router = require("express").Router();

router.put("/", async (req, res) => {
    const result = await userDetailService.updateUserDetail(req.user._id, req.body);
    res.success(result);
});

router.get("/", async (req, res) => {
    const result = await userDetailService.getUserDetail(req.user._id);
    res.success(result);
});

module.exports = router;