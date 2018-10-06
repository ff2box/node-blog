const router = require("express").Router();
const blogService = require("../service/blogService");

router.get("/:id", async (req, res) => {
    const result = await blogService.getBlogById(req.params.id);
    res.success(result);
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
};

router.delete("/:id", async (req, res) => {
    const result = await blogService.deleteBlog(req.params.id, req.user._id);
    res.success(result);
});

module.exports = router;