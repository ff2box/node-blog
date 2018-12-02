# **个人博客后端项目**

该博客项目采用前后端分离，idea+nodejs+git+npm进行开发，属于个人博客网站的后端部分。从产品设计到产品研发，均由个人完成，其中参考了“简书”的功能设计。

## 环境配置

```Nodejs 8.11.4+```

## 安装

```
$ git clone git@github.com:Pologinfeejz/node-blog.git
$ npm install
```

## 运行

```$ node app.js```

 Mac/Linux服务器启动默认端口为 8000,若不想使用 8000 端口,可使用以下命令:

```$ PORT=4000 node app.js```

windows 下使用 git-bash 或者 cmder 等终端执行以下命令:

```$ set PORT=4000 && node app.js```

## 功能特性

- [单元测试](#单元测试)

- [项目入口](#项目入口)

  - [项目配置](#项目配置)

  - [中间件](#中间件)

  - [数据库结构](#数据库结构)
  - [功能模块](#功能模块)
    - [用户模块](#用户模块)
    - [用户详情模块](#用户详情模块)
    - [博客模块](#博客模块)
    - [博客详情及评论模块](#博客详情及评论模块)
    - [好友模块](#好友模块)

- [MongoDB示例](#MongoDB示例)

- [要点介绍](#要点介绍)

### 单元测试

[`test`](https://github.com/Pologinfeejz/node-blog/tree/master/test)

### 项目入口

[`app.js`](https://github.com/Pologinfeejz/node-blog/blob/master/app.js)

#### 项目配置

[`config`](https://github.com/Pologinfeejz/node-blog/tree/master/config)

#### 中间件

[`midware`](https://github.com/Pologinfeejz/node-blog/tree/master/midware)

#### 数据库结构

[`model`](https://github.com/Pologinfeejz/node-blog/tree/master/model)

#### 功能模块

##### 用户模块

[`userRouter.js`](https://github.com/Pologinfeejz/node-blog/blob/master/router/userRouter.js)

[`userService.js`](https://github.com/Pologinfeejz/node-blog/blob/master/service/userService.js)

##### 用户详情模块

[`userDetailRouter.js`](https://github.com/Pologinfeejz/node-blog/blob/master/router/userDetailRouter.js)

[`userDetailService.js`](https://github.com/Pologinfeejz/node-blog/blob/master/service/userDetailService.js)

##### 博客模块

[`blogRouter.js`](https://github.com/Pologinfeejz/node-blog/blob/master/router/blogRouter.js)

[`blogService.js`](https://github.com/Pologinfeejz/node-blog/blob/master/service/blogService.js)

##### 博客详情及评论模块

[`contentRouter.js`](https://github.com/Pologinfeejz/node-blog/blob/master/router/contentRouter.js)

[`contentService.js`](https://github.com/Pologinfeejz/node-blog/blob/master/service/contentService.js)

##### 好友模块

[`friendRouter.js`](https://github.com/Pologinfeejz/node-blog/blob/master/router/friendRouter.js)

[`friendService.js`](https://github.com/Pologinfeejz/node-blog/blob/master/service/friendService.js)

### MongoDB示例

查询数据库截图中的toId字段值：

![image](https://github.com/Pologinfeejz/node-blog/mongodb_aggregate.jpg)

```javascript
async function findBySubCommentId(id, commentId, subCommentId) {
    let res;
    //aggregate 方法
    res = await Content.aggregate([
        {
            // _id: id
            $match: {_id: mongoose.Types.ObjectId(id)}
        }, {
            $project: {
                _id: true,
                targetComment: {
                    $filter: {
                        // input: "$comments.$[i].subComments",
                        // input: "$comments.$[i].subComments.$[j]",
                        input: "$comments",
                        as: "comment",
                        cond: {
                            // $eq: [{$type: "$$comment.subComments"}, "array"]
                            // $not: {
                            $in: ["$$comment._id", [mongoose.Types.ObjectId(commentId)]]
                            // }
                        }
                    },
                }
            }
            /*
[ { _id: 5bb7794b232dec02780c24e8, targetComment: [ [Object] ] } ]
             */
        }, {
            $unwind: {
                path: "$targetComment",
                preserveNullAndEmptyArrays: false
            }

            /*
[ { _id: 5bb7794b232dec02780c24e8,
targetComment:
 { _id: 5bb7799b60e1960fa8b8e398,
   date: 2018-10-05T14:47:55.414Z,
   index: 2,
   approvalCount: 0,
   sendId: 5bb76d0015fdea1900521b0d,
   commentBody: '这是第 3 个评论内容哦~',
   subComments: [Array] } } ]
             */

        }, {
            $project: {
                _id: false,
                targetSubComment: {
                    $filter: {
                        input: "$targetComment.subComments",
                        as: "subComment",
                        cond: {
                            // "$subComment._id": {$eq: mongoose.Types.ObjectId(subCommentId)}
                            // $not: {
                            $in: ["$$subComment._id", [mongoose.Types.ObjectId(subCommentId)]]
                            // }
                        }
                    },
                }
            }
            /*
[ { targetSubComment: [ [Object] ] } ]
             */

        }, {
            $unwind: {
                path: "$targetSubComment",
                preserveNullAndEmptyArrays: false
            }
            /*
[ { targetSubComment:
 { _id: 5bbc584869405b0a70ddb584,
   date: 2018-10-09T07:26:11.433Z,
   toId: 5bb76d0015fdea1900521b0d,
   subCommentBody: '<script>\......' } } ]
             */

        }, {
            $project: {
                toId: "$targetSubComment.toId"
            }
            /*
[ { toId: 5bb76d0015fdea1900521b0d } ]
             */

            // }, {
            //     $out: "$targetSubComment"
        }
    ]);
    return res;
}
```

### 要点介绍

```
项目整体结构：express、midware、router、service、model、mongodb。
登录+用户模块：通过token实现自动登录，通过中间件校验token实现用户的权限访问控制。提供注册、登录、删除用户、查询用户等功能。
博客+评论模块：提供新增、更新、删除、查询（首页、分页、账户等）博客详情的API。博客正文内容和评论内容、子评论内容，通过两重嵌套数组进行存储，可实现评论、子评论的增删改查。
好友+关注模块：用户之间互相关注的功能实现，提供关注、被关注的相应crud操作。
测试模块：对所有的service API，都编写测试代码进行功能初步测试。
其他方面：统计了用户数据，博客、文字、关注、被关注、喜欢、被喜欢等数据。
采用mongodb一些高级crud，包括一些$语法的使用，以优化数据库操作。如populate联结查询，aggregate聚合查询（多重嵌套数据指定数据）等。项目预研了使用redis缓存高频率数据。
```