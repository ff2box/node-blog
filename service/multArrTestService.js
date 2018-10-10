const MultArrTest = require('../model/multArrTest');
const mongoose = require('mongoose');

async function add(data) {
    const res = await MultArrTest.create(data);
    return res;
}

// https://www.jianshu.com/p/9adf30a71fc3
/**
 在$position位置拼接$each数组，并且将拼接得出的数组长度截断为$slice。
 令数组拼接后长度为length，$slice>0
 截取[0,$slice-1]，$slice<0截取[length-|$slice|,length)，当length-|$slice|<=0时，数组清空。
 $sort排序在截断$slice操作前执行，即先排序再截断。
 * @param data
 * @returns {Promise<void>}
 */
async function addOne(data) {
    /*
    $push:{
        <field>:{
            $position:<num>,    //索引>0
            [$slice]:<num>, //可选，>0 从头部开始截取（尾插）；<0 从尾部向上截取（头插）；0 删除全部
            [$sort]:{<field>:<num>},    //可选：-1 降序，1 升序
            $each:[{<field1>:<value1>, ...},{<field1>:<value1>, ...}, ...]
        }
    }
     */
}

/*
1.1外层数组插入
 */
async function update1() {
    const res = MultArrTest.update({
        "mySchema": "attachment"
    }, {
        $push: {
            fields: {
                "interactive": false,
                "name": "1565489.xlsx",
                "data": ["-", {
                    "action": true,
                    "visible": true,
                    "type": "button",
                    "innerText": "view",
                    "value": {
                        "url": "https://pythonolyk.wordpress.com/2016/01/17/1565489.xlsx"
                    }
                }]
            }
        }
    });
    return res;
}

/*
1.2带键值内嵌数组插入

这里要用到占位符，MongoDB 3.6+的特性，能解决旧版本无解的内嵌元素定位问题，在旧版只能修改外层数组，修改内嵌数组需要将外层数组元素整个替换。
已弃坑项目 Robotmongo / Robot3T 下不能运行以下查询，仅支持到MongoDB 3.4，应使用自带Shell环境或换用NoSQL Manager。

往attachment模型添加一列，即往所有的内嵌字段data添加一个对象，且仅当data字段存在且类型为数组时生效。

假如内嵌数组data的实际类型为String，那么查询就会报错，出于严谨性考虑，因此需要在arrayFilters中为data字段及其元素判断设置过滤条件，不符合条件的data字段不被执行插入操作。
注意，arrayFilters中的占位符i指代数组data的元素本体，并非数组元素索引，arrayFilters每个元素绑定一个占位符的子查询。
i的类型为Object时，可使用"Element Query Operators"进行过滤，即可以使用$exists和$type，
当i的类型为数组或字符串时，可使用值域判断相关的操作符$in、$eq等，当i类型为数组时，可以使用"Array Query Operators"。
 */
async function update2() {
    const res = MultArrTest.update({
            "mySchema": "attachment",
        }, {
            $push: {
                "fields.$[i].data": {
                    innerText: "new column"
                }
            }
        }, {
            arrayFilters: [{
                i: {
                    $type: "object"
                },
                "i.data": {
                    $exists: true   //若不设置该条件，当data字段不存在时，会自动创建data并插入元素
                },
                "i.data": {
                    $type: "array"   //校验类型，实际上也起到了 {$exists: true} 的作用
                }
            }]
        }
    );
    return res;
}

/*
1.3无键值内嵌数组插入
1、无 $elemMatch

多维数组不带键值，需要做好$type判断。

往graph模型的tree图表绑定数据的叶子元素添加一个节点，
表现为["history","geography","painting"]里面多了个字符串。

2、有 $elemMatch

由于使用k指定过滤为数组，可以使用$elemMatch数组操作符进行具体匹配，
定向在"arts"类别下添加节点，也可以使用$all:["arts"]。
如何细化匹配视具体数据而言，如果所有元素数据都是相同的，那就无法做到单一定位修改。
 */
async function update3() {
    MultArrTest.update({
        mySchema: "graph"
    }, {
        $push: {
            "fields.$[i].data.$[j].value.$[k].$[l]": "leaf"
        }
    }, {
        arrayFilters: [
            {
                i: {
                    $type: "object",
                },
                "i.name": {$eq: "tree"},
                "i.data": {
                    $type: "array"
                }
            }, {
                j: {
                    $type: "object"
                },
                "j.value": {
                    $type: "array"
                }
            }, {
                k: {
                    $type: "array",
                    $elemMatch: {$eq: "arts"} //$all:["arts"]
                }
            }, {
                l: {
                    $type: "array"
                }
            }
        ]
    })
}

/*
2.1无键值内嵌数组的删除
 */
/**
 更新和删除是原子操作，
 暂没有类似removaAt(index)根据索引删除的操作符，需要先置空再删除。

 * @returns {Promise<*>}
 */
async function updateDelete() {
    /*
这个方法并没有测试成功！
这里写的 $unset $pop 层级关系和demo是不一样，但是demo中会编译报错
     */
    let res = await MultArrTest.update({
        "mySchema": "report"
    }, {
        $pull: {
            "fields.$[i].data.$[j]": {
                $in: ["physical", "geography"]
            }
        }
    }, {
        $unset: {
            "fields.$[i2].data.1.1": {}
        }
    }, {
        $pop: {
            "fields.$[i2].data.2": 1,
        }
    }, {
        arrayFilters: [
            {
                i: {$type: "object"},
                "i.name": {$eq: "subject"}
            }, {
                j: {$type: "array"},
            }, {
                "i2": {$type: "object"},
                "i2.name": {$not: {$in: ["name", "subject"]}}
            }
        ]
    });
    res = await MultArrTest.update({
        "mySchema": "report"
    }, {
        $pull: {
            "fields.$[i].data.1": null
        }
    }, {
        arrayFilters: [
            {
                "i": {$type: "object"},
                "i.name": {$not: {$in: ["name", "subject"]}}
            }
        ]
    });

    return res;
}

/*
3.1常用聚集操作 查
 */
/**
 聚集操作符$in、$not、$type单独一套，与同名的查询操作符用法不一样，
 尤其是$type，聚集操作符{$type:value}识别数据类型，返回字符串"string"、"object"等，
 与查询操作符{$type:type}刚好反过来。
 * @returns {Promise<*>}
 */
async function aggregate() {
    const res = await MultArrTest.aggregate([
        {
            // $match: {"mySchema": "report"}
            // $match: {_id: "5bbc889d6a0bce4e7411dcac"}
            $match: {_id: mongoose.Types.ObjectId("5bbc889d6a0bce4e7411dcac")}
            // _id: ObjectId("5bbc889d6a0bce4e7411dcac")   //错误，不能在aggregate 方法中使用
        }, {
            $project: { //对结果过滤
                _id: false, //过滤掉字段 _id
                scores: {   //自定义的字段名
                    $filter: {
                        input: "$fields",   //filter的源数据
                        as: "field",    //每一个fields 元素的别名，不会返回
                        cond: { //过滤操作
                            $not: {
                                $in: ["$$field.name", ["name", "subject"]]
                            }
                        }
                    }
                }
            }
            /*
[ { scores: [ [Object], [Object] ] } ]
================
{ _id: 5bbc889d6a0bce4e7411dcae,
  data: [ 545, [ '85.0', '100.0', '85.0' ], [ '92.0', '91.0', '92.0' ] ],
  interactive: true,
  name: 'Wang' }
{ _id: 5bbc889d6a0bce4e7411dcad,
  data: [ 527, [ '88.0', '99.0', '88.0' ], [ '66.0', '98.0', '88.0' ] ],
  interactive: true,
  name: 'Liu' }
             */

        }, {
            $unwind: {
                path: "$scores",
                preserveNullAndEmptyArrays: false
            }
            /*
    [ { scores:
     { _id: 5bbc889d6a0bce4e7411dcae,
       data: [Array],
       interactive: true,
       name: 'Wang' } },
    { scores:
     { _id: 5bbc889d6a0bce4e7411dcad,
       data: [Array],
       interactive: true,
       name: 'Liu' } } ]
    ================没有打forEach
                 */

        }, {
            $project: {
                name: "$scores.name",
                scores: {
                    $filter: {
                        input: "$scores.data",
                        as: "score",
                        cond: {
                            //聚集操作符{$type:value}识别数据类型
                            $eq: [{$type: "$$score"}, "array"]
                        }
                    }
                }
            }
            /*
[ { name: 'Wang', scores: [ [Array], [Array] ] },
  { name: 'Liu', scores: [ [Array], [Array] ] } ]
================这里只打印了第一个scores
[ '85.0', '100.0', '85.0' ]
[ '92.0', '91.0', '92.0' ]
             */

        }, {
            $project: {
                name: "$name",
                arts: {$arrayElemAt: ["$scores", 0]},   //取scores 数组的第几个元素，进行赋值
                science: {$arrayElemAt: ["$scores", 1]}
            }
            /*
[ { name: 'Wang',
    arts: [ '85.0', '100.0', '85.0' ],
    science: [ '92.0', '91.0', '92.0' ] },
  { name: 'Liu',
    arts: [ '88.0', '99.0', '88.0' ],
    science: [ '66.0', '98.0', '88.0' ] } ]
================没有打forEach
             */

        }, {
            $project: {
                name: "$name",
                history: {$arrayElemAt: ["$arts", 0]},
                painting: {$arrayElemAt: ["$arts", 2]},
                math: {$arrayElemAt: ["$science", 0]},
                chemistry: {$arrayElemAt: ["$science", 1]},
                arts: {$sum: "$arts"},  //对指定的集合，进行求和，并赋值
                science: {$sum: "$science"}
            }
            /*
[ { name: 'Wang',
    history: '85.0',
    painting: '100.0',
    math: '92.0',
    chemistry: '91.0',
    arts: 0,
    science: 0 },
  { name: 'Liu',
    history: '88.0',
    painting: '99.0',
    math: '66.0',
    chemistry: '98.0',
    arts: 0,
    science: 0 } ]
================由于 $sum 的使用不正确，这里未成功，
但是官方也是这么写的：https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/#pipe._S_addFields
因为这里的数字是字符串的缘故！
             */

        }, {
            $addFields: {   //添加字段
                total: {$sum: ["$arts", "$science"]}
            }
            /*
[ { name: 'Wang',
    history: '85.0',
    painting: '85.0',
    math: '92.0',
    chemistry: '91.0',
    arts: 0,
    science: 0,
    total: 0 },
  { name: 'Liu',
    history: '88.0',
    painting: '88.0',
    math: '66.0',
    chemistry: '98.0',
    arts: 0,
    science: 0,
    total: 0 } ]
================
             */

            // }, {
            //     $out: "scores"
            /*
            最后这一步操作，未成功！
             */
        }
    ]);
    return res;
}

/*
4.1 改
 */
async function updateModify() {
    const res = await MultArrTest.update({
        "mySchema": "report"
    }, {
        $set: {
            // "fields.$[i].data.0":(arts_Wang+science_Wang),
            // "fields.$[i2].data.0":(arts_Liu+science_Liu)
            "fields.$[i].data.0": 999,
            "fields.$[i2].data.0": 888
        }
    }, {
        arrayFilters: [
            {
                i: {$type: "object"},
                "i.name": {$eq: "Wang"}
            }, {
                i2: {$type: "object"},
                "i2.name": {$eq: "Liu"}
            }
        ]
    });
    return res;
}

module.exports = {
    /*一、增*/
    add,
    update1, //插入
    update2,

    /*二、删*/
    updateDelete,

    /*三、查*/
    aggregate,

    /*四、改*/
    updateModify,
};