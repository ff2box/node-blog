const userDetailService = require("../service/userDetailService");
const router = require("express").Router();

router.put("/", async (req, res) => {
    const result = await userDetailService.updateUserDetail(req.user._id, req.body);
    res.success(result);
});

router.get("/:page", async (req, res) => {
    // let result;
    // console.log(req.query.page);
    // if (req.query.page != null) {
    //     result = await userDetailService.getUserDetailsByPage(req.query.page);
        // } else {
        //     result = await userDetailService.getUserDetail(req.user._id);
    // }
    const result = await userDetailService.getUserDetailsByPage(req.params.page);
    res.success(result);
});

router.get("/", async (req, res) => {
    console.log(req.query.id);
    const result = await userDetailService.getUserDetail(req.query.id);
    res.success(result);
});

module.exports = router;