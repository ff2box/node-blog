const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Field = new Schema();
Field.add({
    interactive: Boolean,
    name: String,
    data: []
});
const multArrTest = new Schema({
    mySchema: String,
    fields: [Field]
});

module.exports = mongoose.model("multArrTest", multArrTest);