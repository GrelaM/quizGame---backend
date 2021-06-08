"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const triggerAfter = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.default = triggerAfter;
