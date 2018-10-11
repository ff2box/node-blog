const router = require("express").Router();
const blogService = require("../service/blogService");
const userDetailService = require("../service/userDetailService");
const friendService = require("../service/friendService");

router.get("/", async (req, res) => {
    /*
    axios.get("/blog?page=" + this.blogPage).then(res => {
    axios.get("/userDetail/" + this.userDetailPage).then(res => {
     */
    const blogs = await blogService.getIndexBlogsByPage();
    const userDetails = await userDetailService.getUserDetailsByPage();
    // let friends;
    // if (req.user._id) {  //这里缺少user
    //     friends = await friendService.getFriendById(req.user._id);
    // }
    const result = {
        blogs: blogs,
        userDetails: userDetails
    };
    // if (friends)
    //     result.friends = friends;
    res.success(result);
});

router.get('/:action', async (req, res) => {
    if (req.params.action === "blog") {
        const blogs = await blogService.getIndexBlogsByPage(req.query.page);
        res.success({blogs: blogs});
    } else if (req.params.action === "userDetail") {
        const userDetails = await userDetailService.getUserDetailsByPage(req.query.page);
        res.success({userDetails: userDetails});
    } else {
        throw Error("Wrong action.");
    }
});

module.exports = router;