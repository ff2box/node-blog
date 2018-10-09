const router = require('express').Router();
const userService = require("../service/userService");

router.get("/:username", async (req, res) => {
    // let result;
    // if (req.query.page) {
    //     result = await userService.getUsersByPage(req.query.page);
    // } else if (req.params.username) {
    //     result = await userService.getUserInfo(req.params.username);
    // }
    const result = await userService.getUserInfo(req.params.username);
    res.success(result);
});
router.post("/register", async (req, res) => {
    const user = await userService.register(req.body);
    res.success(user);
});
router.post("/login", async (req, res) => {
    // console.log(req.body);
    const token = await userService.login(req.body);
    res.success({
        token,
    });
});
router.delete("/:username", async (req, res) => {
    const result = await userService.deleteUser(req.params.username);
    res.success(result);
});

module.exports = router;
