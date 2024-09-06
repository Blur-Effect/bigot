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
exports.get = get;
exports.applyArgs = applyArgs;
const constants_1 = require("./constants");
function get(obj, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let base = obj;
        let keys = path.split('.');
        for (let i = 0; i < keys.length; i++) {
            base = base[keys[i]];
            // if base is a function we execute it
            if (base instanceof Function) {
                // if is an async function we await it
                if (base instanceof constants_1.AsyncFunction)
                    base = yield base();
                else
                    base = base();
            }
        }
        return base;
    });
}
function applyArgs(args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultArgs = [];
        for (let i = 0; i < args.length; i++) {
            // begins and ends with double or single quotes we leave it as is
            if ((args[i][0] === '"' && args[i][args[i].length - 1] === '"') || (args[i][0] === "'" && args[i][args[i].length - 1] === "'")) {
                resultArgs.push(args[i].substring(1, args[i].length - 1));
                continue;
            }
            // if is a number we convert it to number
            if (!isNaN(Number(args[i]))) {
                resultArgs.push(Number(args[i]));
                continue;
            }
            // if is a boolean we convert it to boolean
            if (args[i] === 'true' || args[i] === 'false') {
                resultArgs.push(args[i] === 'true');
                continue;
            }
            resultArgs.push(yield get(context, args[i]));
        }
        return resultArgs;
    });
}
