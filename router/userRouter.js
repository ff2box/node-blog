const router = require('express').Router();
const userService = require("../service/userService");

router.get("/:username", async (req, res) => {
    const user = await userService.getUserInfo(req.params.username);
    res.success(user);
});
router.post("/register", async (req, res) => {
    const user = await userService.register(req.body);
    res.success(user);
});
router.post("/login", async (req, res) => {
    const token = await userService.login(req.body);
    res.success({
        token: token
    });
});
router.delete("/:username", async (req, res) => {
    const result = await userService.deleteUser(req.params.username);
    res.success(result);
});

module.exports = router;
