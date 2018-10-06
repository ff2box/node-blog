const router = require("express").Router();
const contentService = require("../service/contentService");
/*
 * 只提供查询的方法，别的操作是通过操作blog来实现的
 */
router.get("/:id", async (req, res) => {
    const result = await contentService.getContentById(req.params.id);
    res.success(result);
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
    const result = await contentService.updateCommentById(req.params.id, req.body);
    res.success(result);
});

router.put("/", async (req, res) => {
    let result;
    if (req.query.commentId) {
        result = await contentService.updateSubCommentById(req.params.id, req.query.commentId, req.body);
    } else {
        result = await contentService.updateCommentById(req.params.id, req.body);
    }
    res.success(result);
});

module.exports = router;