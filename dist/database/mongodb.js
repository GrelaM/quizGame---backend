"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const MongoClient = mongodb_1.default.MongoClient;
MongoClient.connect('mongodb+srv://<USER>:<PASSWORD>@cluster0.s37zq.mongodb.net/quizGameDatabase?retryWrites=true&w=majority')
    .then(result => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
