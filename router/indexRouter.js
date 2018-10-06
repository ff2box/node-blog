const router = require("express").Router();

router.get("/", async (req, res) => {
    res.success("欢迎来到 bin 博客。");
});

module.exports = router;