"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var MongoClient = mongodb_1["default"].MongoClient;
MongoClient.connect('mongodb+srv://quizgameadmin:zFzcAHbtaVv6wwt6@cluster0.s37zq.mongodb.net/quizGameDatabase?retryWrites=true&w=majority')
    .then(function (result) { return console.log('MongoDB connected...'); })["catch"](function (err) { return console.log(err); });
