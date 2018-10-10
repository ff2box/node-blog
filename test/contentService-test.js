require('../db');
const contentService = require("../service/contentService");
const User = require("../service/userService");

async function testGetContentById() {
    const id = "5bb7794b232dec02780c24e8";
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
    const id = "5bbbb3e7f916c716841a3c79";
    const res = await contentService.deleteContentById(id);
    console.log(res);
}

async function testUpdateCommentById() {
    const id = "5bbbb3e7f916c716841a3c79";
    const comment = {
        "sendId": "5bb76d0015fdea1900521b0d",
        "commentBody": `at Proxy.render (eval at ./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-2ea247d6\",\"hasScoped\":true,\"transformToRequire\":{\"video\":[\"src\",\"poster\"],\"source\":\"src\",\"img\":\"src\",\"image\":\"xlink:href\"},\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/pages/blogContent/components/CommentItem.vue (app.js:2539), <anonymous>:7:9)`
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

async function testChangeCommentById() {
    const id = "5bb7794b232dec02780c24e8";
    const commentId = "5bbbb3e7f916c716841a3c79";
    const comment = {
        "sendId": "5bba80b1bca4aa2918a3d76f",
        "commentBody": "果需要学习更多有关使用这些事件进行编程的内容，请学习我们的 JavaScript 教程 和 DHTML 教程。\n" +
            "\n" +
            "下面的表格列出了可插入 HTML 5 元素中以定义事件行为的标准事件属性。\n" +
            "\n" +
            "Window 事件属性 - Window Event Attributes\n" +
            "表单事件 - Form Events\n" +
            "键盘事件 - Keybord Events\n" +
            "鼠标事件 - Mouse Events\n" +
            "媒介事件 - Media Events",
    };
    const res = await contentService.changeCommentById(id, commentId, comment);
    console.log(res);
}

async function testChangeSubCommentById() {
    const id = "5bb7794b232dec02780c24e8";
    const commentId= "5bb7799b60e1960fa8b8e398";
    const subCommentId = "5bbc584869405b0a70ddb584";
    const sendId = "5bb796e415a113298013a824";
    const subComment = {
        "sendId": sendId,
    };
    const res = await contentService.changeSubCommentById(id, commentId, subCommentId, sendId);
    console.log(res);
}

async function testFindBySubCommentId() {
    const id = "5bb7794b232dec02780c24e8";
    const commentId= "5bb7799b60e1960fa8b8e398";
    const subCommentId = "5bbc584869405b0a70ddb584";
    const res = await contentService.findBySubCommentId(id, commentId, subCommentId);
    console.log(res);
    // res[0].comment.forEach(val => {
    //     console.log(val);
    // });

}


// testGetContentById();
// testGetContentByIds();
// testUpdateContentById();
// testDeleteContentById();

// testUpdateCommentById();
// testUpdateSubCommentById();

// testFindBySubCommentId();
// testChangeCommentById();

testChangeSubCommentById();
