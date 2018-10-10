const router = require("express").Router();
const blogService = require("../service/blogService");

router.get("/", async (req, res) => {
    let result;
    if (req.query.page != null) {
        result = await blogService.getIndexBlogsByPage(req.user._id, req.query.page);
        // } else if (req.params.id) {
        //     result = await blogService.getBlogById(req.params.id);  //router.get("/:id", async (req, res) => {
    } else {
        res.failure("非法请求！");
    }
    res.success(result);
});

router.get("/:user", async (req, res) => {
    if (req.params.user === "detail") {
        const result = await blogService.getUserAllDetail(req.user._id);
        res.success(result);
    } else {
        res.failure("Wrong action!")
    }
});

router.post("/", async (req, res) => {
    const blog = req.body;
    blog.userId = req.user._id;
    const result = await blogService.addBlog(blog);
    res.success(result);
});

router.put("/:id", async (req, res) => {
    const result = await blogService.updateBlog(req.params.id, req.user._id, req.body);
    res.success(result);
});

router.delete("/:id", async (req, res) => {
    const result = await blogService.deleteBlog(req.params.id, req.user._id);
    res.success(result);
});

module.exports = router;