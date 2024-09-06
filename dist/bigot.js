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
exports.Bigot = void 0;
const types_1 = require("./types");
const scans_1 = require("./scans");
const context_1 = require("./context");
const constants_1 = require("./constants");
class Bigot {
    constructor() {
        this.cache = new Map();
        this.functions = new Map();
        this.decorators = new Map();
    }
    registerFunctions(key, func) {
        this.functions.set(key, func);
    }
    registerDecorator(key, func) {
        this.decorators.set(key, func);
    }
    scanHealthy(scan) {
        const decorators = [];
        for (let index = 0; index < scan.length; index++) {
            if (scan[index][0] === types_1.Types.DECORATOR)
                decorators.push(index);
            if (scan[index][0] === types_1.Types.DECORATOR_END) {
                if (decorators.length > 0)
                    decorators.pop();
                else
                    throw new Error('Command "{{@end}}" orphan');
            }
            if (scan[index][0] === types_1.Types.DECORATOR && !this.decorators.has(scan[index][1])) {
                throw new Error(`Decorator "${scan[index][1]}" not found`);
            }
            if (scan[index][0] === types_1.Types.FUNCTION && !this.functions.has(scan[index][1])) {
                throw new Error(`Function "${scan[index][1]}" not found`);
            }
        }
        /**
         * We verify that all open decorators are closed
         * */
        if (decorators.length > 0)
            throw new Error(`Decorator: {{@${scan[decorators.length - 1].slice(1).join(' ')}}} is not closed`);
        return scan;
    }
    renderDecorator(start, scan, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scan[start][0] !== types_1.Types.DECORATOR)
                throw new Error('Invalid decorator');
            const args = scan[start].slice(2);
            const argsValues = args.length ? yield (0, context_1.applyArgs)(args, context) : [];
            /**
             * Find end decorator and make a sub array with the content of the decorator
             * */
            let end = 0;
            let count = 0;
            let sub = [];
            for (let i = start; i < scan.length; i++) {
                if (scan[i][0] === types_1.Types.DECORATOR)
                    count++;
                else if (scan[i][0] === types_1.Types.DECORATOR_END)
                    count--;
                if (count === 0) {
                    end = i;
                    break;
                }
                if (i > start)
                    sub.push(scan[i]);
            }
            if (count !== 0)
                throw new Error(`Decorator: {{@${scan[start].slice(1).join(' ')}}} is not closed`);
            argsValues.push({
                context,
                render: (args) => this.render(sub, Object.assign(Object.assign({}, context), args))
            });
            const func = this.decorators.get(scan[start][1]);
            const funcValue = func instanceof constants_1.AsyncFunction ? yield func(...argsValues) : func(...argsValues);
            return [end, funcValue || ''];
        });
    }
    renderFunction(scan, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = scan.slice(2);
            const argsValues = args.length ? yield (0, context_1.applyArgs)(args, context) : [];
            argsValues.push({ context });
            const func = this.functions.get(scan[1]);
            const funcValue = func instanceof constants_1.AsyncFunction ? yield func(...argsValues) : func(...argsValues);
            return `${funcValue || ''}`;
        });
    }
    render(scan, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = '';
            for (let i = 0; i < scan.length; i++) {
                if (scan[i][0] === types_1.Types.TEXT)
                    result += scan[i][1];
                if (scan[i][0] === types_1.Types.OBJECT)
                    result += yield (0, context_1.get)(context, scan[i][1]);
                if (scan[i][0] === types_1.Types.FUNCTION)
                    result += yield this.renderFunction(scan[i], context);
                if (scan[i][0] === types_1.Types.DECORATOR) {
                    const [end, value] = yield this.renderDecorator(i, scan, context);
                    result += value;
                    i = end;
                }
            }
            return result;
        });
    }
    compile(key, text, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cache.has(key))
                this.cache.set(key, this.scanHealthy((0, scans_1.scanText)(text)));
            const result = yield this.render(this.cache.get(key), ctx);
            // replace line breaks duplicated by a single line break
            return result.replace(/(\n){2,}/gm, '\n').replace(/\s{2,}/gm, ' ');
        });
    }
}
exports.Bigot = Bigot;
