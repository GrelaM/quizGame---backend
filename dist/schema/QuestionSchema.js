"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSchema = void 0;
exports.QuestionSchema = {
    'Question': {
        type: String,
        required: true
    },
    'Category': {
        type: String,
        required: true
    },
    'Difficulty': {
        type: Number,
        required: true
    },
    'Hint #1': {
        type: String,
        required: true
    },
    'Hint #2': {
        type: String,
        required: true
    },
    'Hint #3': {
        type: String,
        required: true
    },
    'Correct': {
        type: String,
        required: true
    },
    'Incorrect #1': {
        type: String,
        required: true
    },
    'Incorrect #2': {
        type: String,
        required: true
    },
    'Incorrect #3': {
        type: String,
        required: true
    }
};
