const router = require('express').Router();
const userService = require("../service/userService");

router.get("/:action", async (req, res) => {
    if (req.req.params.action === "detail") {
        const result = await userService.getUserDetail(req.user._id);
        res.success(result);
    } else {
        // res.failure("Wrong action!")
        throw Error("Wrong action!");
    }
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
