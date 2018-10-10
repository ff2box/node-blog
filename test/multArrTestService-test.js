require('../db');
const multArrTestService = require("../service/multArrTestService");
const MultArrTest = require('../model/multArrTest');

/*
Field.add({
    interactive: Boolean,
    name: String,
    data: []
});
const Person = new Schema({
    schema: String,
    fields: [Field]
});
 */
async function testAdd() {
    let data = {
        "mySchema": "attachment",
        "fields": [{
            "interactive": false,
            "name": "name",
            "data": ["attachment", "action"]
        }, {
            "interactive": false,
            "name": "hello.jpg",
            "data": [
                "<img src='http://ben.com/hello.jpg'>",
                {
                    "action": true,
                    "visible": true,
                    "type": "button",
                    "innerText": "view",
                    "value": {
                        "usl": "http://ben.com/hello.jpg"
                    }
                }
            ]
        }]
    };
    let res = await multArrTestService.add(data);

    data = {
        "mySchema": "report",
        "fields": [{
            "interactive": false,
            "name": "name",
            "data": ["statistic", "arts", "science"]
        }, {
            "interactive": false,
            "name": "subject",
            "data": [
                {
                    "innerText": "total"
                },
                ["history", "physical", "painting"],
                ["math", "chemistry", "geography"]
            ]
        }, {
            "interactive": true,
            "name": "Wang",
            "data": [545.0, ["85.0", "100.0", "85.0"], ["92.0", "91.0", "92.0"]]
        }, {
            "interactive": true,
            "name": "Liu",
            "data": [527.0, ["88.0", "99.0", "88.0"], ["66.0", "98.0", "88.0"]]
        }]
    };
    res = await multArrTestService.add(data);

    data = {
        "mySchema": "graph",
        "fields": [{
            "interactive": false,
            "name": "shape",
            "data": ["type"]
        }, {
            "interactive": true,
            "name": "tree",
            "data": [
                {
                    "innerText": "draw",
                    "value": ["subjects",
                        ["arts", ["history", "physical", "painting"]],
                        ["science", ["math", "chemistry", "geography"]]]
                }
            ]
        }, {
            "interactive": true,
            "name": "circle",
            "data": {
                "innerText": "draw",
                "value": {
                    "point": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "radius": 666.0
                }
            }
        }]
    };
    res = await multArrTestService.add(data);
    console.log(res);
}
async function testUpdate1() {
    const res = await multArrTestService.update1();
    console.log(res);
}
async function testUpdate2() {
    const res = await multArrTestService.update2();
    console.log(res);
}

async function testAggregate() {
    const res = await multArrTestService.aggregate();
    console.log(res);
    console.log("================");
    // res[0].scores.forEach(val => {
    //     console.log(val);
    // });
}

async function testUpdateModify() {
    const res = await multArrTestService.updateModify();
    console.log(res);
}
async function testUpdateDelete() {
    const res = await multArrTestService.updateDelete();
    console.log(res);
}

// testAdd();
// testUpdate1();
// testUpdate2();

// testAggregate();
testUpdateDelete();
// testUpdateModify();