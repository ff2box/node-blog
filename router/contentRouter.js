const router = require("express").Router();
const contentService = require("../service/contentService");
const userDetailService = require("../service/userDetailService");
const userService = require("../service/userService");
const blogService = require("../service/blogService");
/*
 * 只提供查询的方法，别的操作是通过操作blog来实现的
 */
router.get("/", async (req, res) => {
    // const result = await contentService.getContentById(req.params.id);
    // res.success(result);
    //TODO
    // console.log(req.query);
    const content = await contentService.getContentById(req.query.id);
    const userDetail = await userDetailService.getUserDetail(req.query.userId);
    const username = await userService.getUsernameById(req.query.userId);
    const blog = await blogService.getBlogByContentId(req.query.id);
    res.success({content: content, userDetail: userDetail, username: username.username, blog: blog});
});
// router.post("/", async (req, res) => {
//     const result = await contentService.addContent(req.body);
//     res.success(result);
// });
// router.put("/:id", async (req, res) => {
//     const result = await contentService.updateContentById(req.params.id, req.body);
//     res.success(result);
// });
// router.delete("/:id", async (req, res) => {
//     const result = await contentService.deleteContentById(req.params.id);
//     res.success(result);
// });

router.put("/:id", async (req, res) => {
    let result;
    // console.log(req.body.comment);
    if (req.body.comment) {
        result = await contentService.updateCommentById(req.params.id, req.body.comment);
    } else if (req.body.subComment) {
        req.body.subComment.sendId = req.user._id;
        console.log(req.body);
        result = await contentService.updateSubCommentById(req.params.id, req.body.commentId, req.body.subComment);
    }
    res.success(result);
});

// router.put("/", async (req, res) => {
//     let result;
//     if (req.query.commentId) {
//         result = await contentService.updateSubCommentById(req.params.id, req.query.commentId, req.body);
//     } else {
//         result = await contentService.updateCommentById(req.params.id, req.body);
//     }
//     res.success(result);
// });

module.exports = router;