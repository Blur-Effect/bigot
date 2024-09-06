"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandAliases = exports.commandEmpty = exports.AsyncFunction = void 0;
const types_1 = require("./types");
exports.AsyncFunction = Object.getPrototypeOf(function () {
    return __awaiter(this, void 0, void 0, function* () { });
}).constructor;
exports.commandEmpty = [-1, []];
exports.commandAliases = {
    [types_1.Types.DECORATOR]: '@',
    [types_1.Types.DECORATOR_END]: '@end',
    [types_1.Types.FUNCTION]: '#'
};
