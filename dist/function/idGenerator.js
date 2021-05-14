"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalSettingsStorage_1 = __importDefault(require("../data/LocalSettingsStorage"));
const gameIdGeneretor = (digits) => {
    const idsArray = LocalSettingsStorage_1.default.artificialGameIds;
    const singleId = () => {
        const elNum = digits;
        let key = '#';
        for (let i = 0; i < elNum; i++) {
            let x = Math.floor(Math.random() * 10);
            key += x;
        }
        return key;
    };
    let generetedId = singleId();
    while (idsArray.includes(generetedId)) {
        singleId();
    }
    LocalSettingsStorage_1.default.saveArtificialGameIds(generetedId);
    return generetedId;
};
exports.default = gameIdGeneretor;
