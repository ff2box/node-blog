const router = require("express").Router();
const blogService = require("../service/blogService");
const userDetailService = require("../service/userDetailService");

router.get("/", async (req, res) => {
    /*
    axios.get("/blog?page=" + this.blogPage).then(res => {
    axios.get("/userDetail/" + this.userDetailPage).then(res => {
     */
    const blogs = await blogService.getIndexBlogsByPage();
    const userDetails = await userDetailService.getUserDetailsByPage();
    const result = {
        blogs: blogs,
        userDetails: userDetails
    };
    res.success(result);
});

module.exports = router;