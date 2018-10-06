require('../db');
const blogService = require("../service/blogService");

async function testAddBlog() {
    // const blog = {
    //     "userId": "5bb75761d8525439288cfd44",
    //     "blogTitle": "写第一个Blog的测试！",
    //     "blogContent": "整型 int / uint ：分别表示有符号和无符号的不同位数的整型变量。 支持关键字 uint8 到 uint256 （无符号，从 8 位到 256 位）以及 int8 到 int256，以 8 位为步长递增。 uint 和 int 分别是 uint256 和 int256 的别名。 运算符： 比较运算符： <= ， < ， == ， != ， >= ， > （返回布尔值） 位运算符： & ， | ， ^ （异或）， ~ （位取反） 算数运算符： + ， - ， 一元运算 - ， 一元运算 + ， * ， / ， % （取余） ， ** （幂）， << （左移位） ， >> （右移位） 除法总是会截断的（仅被编译为 EVM 中的 DIV 操作码）， 但如果操作数都是 字面常数（literals） （或者字面常数表达式），则不会截断。 除以零或者模零运算都会引发运行时异常。 移位运算的结果取决于运算符左边的类型。 表达式 x << y 与 x * 2**y 是等价的， x >> y 与 x / 2**y 是等价的。这意味对一个负数进行移位会导致其符号消失。 按负数位移动会引发运行时异常。 警告 由有符号整数类型负值右移所产生的结果跟其它语言中所产生的结果是不同的。 在 Solidity 中，右移和除是等价的，因此对一个负数进行右移操作会导致向 0 的取整（截断）。 而在其它语言中， 对负数进行右移类似于（向负无穷）取整。"
    // };
    const blog = {
        "userId": "5bb76b5b4e6b651dd49f18f0",
        "blogTitle": "写第10个Blog的测试！",
        "blogContent": "uint 和 int 分别是 uint256 和 int256 的别名。 运算符： 比较运算符： <= ， < ， == ， != ， >= ， > （返回布尔值） 位运算符： & ， | ， ^ （异或）， ~ （位取反） 算数运算符： + ， - ， 一元运算 - ， 一元运算 + ， * ， / ， % （取余） ， ** （幂）， << （左移位） ， >> （右移位） 除法总是会截断的（仅被编译为 EVM 中的 DIV 操作码）， 但如果操作数都是 字面常数（literals） （或者字面常数表达式），则不会截断。 除以零或者模零运算都会引发运行时异常。 移位运算的结果取决于运算符左边的类型。 表达式 x << y 与 x * 2**y 是等价的， x >> y 与 x / 2**y 是等价的。这意味对一个负数进行移位会导致其符号消失。 按负数位移动会引发运行时异常。 警告 由有符号整数类型负值右移所产生的结果跟其它语言中所产生的结果是不同的。 在 Solidity 中，右移和除是等价的，因此对一个负数进行右移操作会导致向 0 的取整（截断）。 而在其它语言中， 对负数进行右移类似于（向负无穷）取整。"
    };
    const res = await blogService.addBlog(blog);
    console.log(res);
}

async function testGetBlogById() {
    const id = "5bb669150d9cc921d8b60245";
    const res = await blogService.getBlogById(id);
    console.log(res);
}

async function testUpdateBlog() {
    const id = "5bb67242b6a9dc0e30c50117";
    const blog = {
        "blogTitle": "写第9个Blog的测试！",
        "blogContent": "而在其它语言中， 对负数进行右移类似于（向负无穷）取整。"
    };
    const res = await blogService.updateBlog(id, blog);
    console.log(res);
}

async function testDeleteBlog() {
    const id = "5bb6720be3db9035045d34d0";
    const res = await blogService.deleteBlog(id);
    console.log(res);
}

async function testGetBlogsByPage() {
    const userId = "5bb76b5b4e6b651dd49f18f0";
    const page = 0;
    const res = await blogService.getBlogsByPage(userId, page);
    console.log(res);
}

async function getAndUpdate() {
    const userId = "5bb76b5b4e6b651dd49f18f0";
    const res = await blogService.getAllBlogs();
    console.log(res);
    res.forEach(async item => {
        // item.userId = userId;
        await blogService.updateBlog(item._id, {userId:userId});
    });
}

testAddBlog();
// testGetBlogById();
// testUpdateBlog();
// testDeleteBlog();
// testGetBlogsByPage();

// getAndUpdate();

