require('../db');
const contentService = require("../service/contentService");

async function testGetContentById() {
    const id = "5bb63a2cda35fa170c521c76";
    const res = await contentService.getContentById(id);
    console.log(res);
}

async function testGetContentByIds() {
    const ids = ["5bb669150d9cc921d8b60244", "5bb669afb2e87e347cab9541"];
    const res = await contentService.getContentByIds(ids);
    console.log(res);
}

async function testUpdateContentById() {
    const id = "5bb669afb2e87e347cab9541";
    const content = "abc";
    const res = await contentService.updateContentById(id, content);
    console.log(res);
}

async function testDeleteContentById() {
    const id = "5bb669afb2e87e347cab9541";
    const res = await contentService.deleteContentById(id);
    console.log(res);
}

async function testUpdateCommentById() {
    const id = "5bb7794b232dec02780c24e8";
    const comment = {
        "sendId": "5bb76d0015fdea1900521b0d",
        "commentBody": "这是第 4 个评论内容哦~"
    };
    const res = await contentService.updateCommentById(id, comment);
    console.log(res);
}

async function testUpdateSubCommentById() {
    const id = "5bb7794b232dec02780c24e8";
    const commentId = "5bb7799b60e1960fa8b8e398";
    const subComment = {
        "sendId": "5bb76b5b4e6b651dd49f18f0",
        "toId": "5bb76d0015fdea1900521b0d",
        "subCommentBody": "这是第 -2- 个子评论内容哦！"
    };
    const res = await contentService.updateSubCommentById(id, commentId, subComment);
    console.log(res);
}

// testGetContentById();
// testGetContentByIds();
// testUpdateContentById();
// testDeleteContentById();

// testUpdateCommentById();
testUpdateSubCommentById();