const Blog = require("../model/blog");
const config = require("../config");
const contentService = require("./contentService");
const mycrypto = require("../util/mycrypto");

async function isBlogExist(id) {
    const result = await Blog.findOne({_id: id});
    return result;
}

async function addBlog(blog) {
    // const blog = req.body;
    // const blog = req.body;
    // blog.userId = req.user._id;
    const body = blog.blogContent;
    const len = body.length;
    blog.contentDesc = len > config.ContentDescLength ? body.substring(0, config.ContentDescLength) + config.Omit : body;
    blog.blogSize = len;
    blog.modifyDate = blog.createdDate;
    blog.contentSha256 = mycrypto.sha256(body);
    blog.blogContent = "";

    const contentRes = await contentService.addContent(body);
    // const contentRes = await contentService.addContent({header: blog.blogTitle, body: body});

    blog.contentId = contentRes._id;
    const result = await Blog.create(blog);

    await afterUpdateBlog(blog.userId, 1, blog.blogSize, 0);

    return result;
}

/**
 * 作者修改 blog 内容/标题
 * @param id
 * @param userId
 * @param blog
 * @returns {Promise<void>}
 */
async function updateBlog(id, userId, blog) {
    const res = await isBlogExist(id);
    if (!res) {
        throw Error(`id为 ${id} 的博客不存在！`);
    }
    // console.log(res);

    const content = blog.blogContent;
    // if (content) {
    const sha256 = mycrypto.sha256(content);
    //需要更新content
    const contentChanged = sha256 !== res.contentSha256;
    if (contentChanged) {
        const len = content.length;
        blog.contentDesc = len > config.ContentDescLength ? content.substring(0, config.ContentDescLength) + config.Omit : content;
        blog.blogSize = len;
        blog.contentSha256 = sha256;
        console.log("len:" + len);

        // contentService.updateContentById(blog.contentId);
        await contentService.updateContentById(res.contentId, content);
    }
    // }
    blog.modifyDate = Date.now();   //新的修改时间
    blog.blogContent = "";

    const result = await Blog.updateOne({_id: id}, blog);
    if (result.n < 1) {
        throw Error("更新失败");
    }

    await afterUpdateBlog(userId, 0, contentChanged ? blog.blogSize - res.blogSize : 0, 0);
}

async function deleteBlog(id, userId) {
    //不能一起删除
    // const result = await Blog.deleteOne({_id: id}).populate("contentId");
    const res = await isBlogExist(id);
    if (res) {
        await contentService.deleteContentById(res.contentId);
    }

    const result = await Blog.deleteOne({_id: id});
    if (result.n < 1) {
        throw Error("删除失败");
    }

    await afterUpdateBlog(userId, -1, -res.blogSize, -res.likeCount);
}

async function getBlogById(id) {
    // const result = await Blog.findOne({_id: id}).populate("contentId userId");
    // const result = await Blog.findOne({_id: id}).populate("contentId");
    const result = await isBlogExist(id);
    return result;
}

async function getUserBlogsByPage(userId, page = 0) {
    const result = await Blog.find({userId: userId}).populate('userId', 'username')
        .skip(page * config.PageCount).limit(config.PageCount)
        .sort("contentDesc").select("-__v");
    return result;
}

async function getIndexBlogsByPage(page = 0) {
    console.log(page);
    const result = await Blog.find().populate('userId', 'username')
        .skip(page * config.PageCount).limit(config.PageCount)
        .sort("createdDate").select("-__v");
    return result;
}

/**
 * 可采用模糊查询：Query.prototype.regex()
 *
 * @param userid
 * @returns {Promise<void>}
 */
async function getBlogsTitleByUsername(userid) {

}

async function getAllBlogs() {
    const result = await Blog.find();
    return result;
}

const userDetailService = require("../service/userDetailService");

async function afterUpdateBlog(userId, blogCount, wordCount, getLikeCount) {
    await userDetailService.updateUserDetailByBlog(userId, blogCount, wordCount, getLikeCount);
}

async function getBlogByContentId(contentId) {
    const res = await Blog.findOne({contentId: contentId}).select("-__v");
    return res;
}

const friendService = require("./friendService");

async function getUserAllDetail(userId) {
    const blogs = await getUserBlogsByPage(userId);
    const userDetail = await userDetailService.getUserDetail(userId);
    const friends = await friendService.getFriendById(userId);
    const userData = {
        myBlogs: blogs,
        myDetail: userDetail,
        myFriends: friends
    };
    return userData;
}

/**
 * exm：更新喜欢blog
 * 1、blog 更新喜欢数：需要blog id
 // * 2、sendId 增加喜欢数：需要 req.user._id，还没有这个字段
 * 3、toId 增加被喜欢数：需要 blog 所属用户 id
 *
 * findOneAndUpdate()：
 *
 * @returns {Promise<void>}
 */
async function updateBlogDetail(userId, body) {
    /*
    这样是可以更新的，但是不能这样写！
     */
    // const res = await Blog.updateOne({_id: body.blogId}, {likeCount: 100});

    let res = await Blog.findOne({_id: body.blogId}, {likeCount: 1});
    const likeCount = res.likeCount;
    res = await Blog.updateOne({_id: body.blogId}, {likeCount: likeCount + body.like});
    if (res.n < 1) {
        throw Error("更新操作失败！");
    }
    res = await userDetailService.updateUserDetailLikeCount(body.toId, body.like);
    return {
        likeCount: likeCount + body.like,
        getLikeCount: res
    };
}

module.exports = {
    addBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getUserBlogsByPage,

    getBlogsTitleByUsername,
    getAllBlogs,
    getBlogByContentId,
    getIndexBlogsByPage,
    getUserAllDetail,
    updateBlogDetail,
};