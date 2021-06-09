"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketNames;
(function (SocketNames) {
    SocketNames["FATAL_ERROR"] = "fatal-error";
    SocketNames["COUNTER"] = "counter";
    SocketNames["QUESTION"] = "question";
    SocketNames["HOST"] = "host";
    SocketNames["PLAYERS_UPDATE"] = "players-update";
    SocketNames["RESULTS"] = "results";
    SocketNames["JOIN"] = "join";
    SocketNames["START_GAME"] = "start-game";
    SocketNames["END_GAME"] = "end-game";
    SocketNames["SOCKET_DISCONNECT"] = "disconnect";
    SocketNames["ANSWER"] = "answer";
})(SocketNames || (SocketNames = {}));
exports.default = SocketNames;
