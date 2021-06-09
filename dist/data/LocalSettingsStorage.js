"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalSettings_1 = __importDefault(require("../models/LocalSettings"));
const LocalSettingsStorage = new LocalSettings_1.default();
exports.default = LocalSettingsStorage;
