import {Types} from "./types";
import {scanText} from "./scans";
import {applyArgs, get} from "./context";
import {AsyncFunction} from "./constants";

export class Bigot {
    protected readonly cache = new Map<string, string[][]>();
    protected readonly functions = new Map<string, Function>();
    protected readonly decorators = new Map<string, Function>();

    registerFunctions(key: string, func: Function) {
        this.functions.set(key, func);
    }

    registerDecorator(key: string, func: Function) {
        this.decorators.set(key, func);
    }

    scanHealthy(scan: string[][]) {
        const decorators: number[] = [];
        for (let index = 0; index < scan.length; index++) {
            if (scan[index][0] === Types.DECORATOR) decorators.push(index);
            if (scan[index][0] === Types.DECORATOR_END) {
                if (decorators.length > 0) decorators.pop();
                else throw new Error('Command "{{@end}}" orphan');
            }

            if (scan[index][0] === Types.DECORATOR && !this.decorators.has(scan[index][1])) {
                throw new Error(`Decorator "${scan[index][1]}" not found`);
            }

            if (scan[index][0] === Types.FUNCTION && !this.functions.has(scan[index][1])) {
                throw new Error(`Function "${scan[index][1]}" not found`);
            }
        }
        /**
         * We verify that all open decorators are closed
         * */
        if (decorators.length > 0) throw new Error(`Decorator: {{@${scan[decorators.length - 1].slice(1).join(' ')}}} is not closed`);

        return scan;
    }

    async renderDecorator(start: number, scan: string[][], context: Record<string, any>): Promise<[number, string]> {
        if (scan[start][0] !== Types.DECORATOR) throw new Error('Invalid decorator');

        const args = scan[start].slice(2);
        const argsValues = args.length ? await applyArgs(args, context) : [];

        /**
         * Find end decorator and make a sub array with the content of the decorator
         * */
        let end = 0;
        let count = 0;
        let sub: string[][] = [];
        for (let i = start; i < scan.length; i++) {
            if (scan[i][0] === Types.DECORATOR) count++;
            else if (scan[i][0] === Types.DECORATOR_END) count--;

            if (count === 0) {
                end = i;
                break;
            }

            if (i > start) sub.push(scan[i]);
        }
        if (count !== 0) throw new Error(`Decorator: {{@${scan[start].slice(1).join(' ')}}} is not closed`);

        argsValues.push({
            context,
            render: (args: Record<string, any>) => this.render(sub, { ...context, ...args })
        });

        const func = this.decorators.get(scan[start][1])!;
        const funcValue = func instanceof AsyncFunction ? await func(...argsValues) : func(...argsValues);

        return [end, funcValue || ''];
    }

    async renderFunction(scan: string[], context: Record<string, any>) {
        const args = scan.slice(2);
        const argsValues = args.length ? await applyArgs(args, context) : [];
        argsValues.push({ context });

        const func = this.functions.get(scan[1])!;
        const funcValue = func instanceof AsyncFunction ? await func(...argsValues) : func(...argsValues);

        return `${funcValue || ''}`;
    }

    async render(scan: string[][], context: Record<string, any>) {
        let result: string = '';
        for (let i = 0; i < scan.length; i++) {
            if (scan[i][0] === Types.TEXT) result += scan[i][1];
            if (scan[i][0] === Types.OBJECT) result += await get(context, scan[i][1]);
            if (scan[i][0] === Types.FUNCTION) result += await this.renderFunction(scan[i], context);
            if (scan[i][0] === Types.DECORATOR) {
                const [end, value] = await this.renderDecorator(i, scan, context);
                result += value;
                i = end;
            }
        }

        return result;
    }

    async compile(key: string, text: string, ctx: Record<string, any>): Promise<string> {
        if (!this.cache.has(key)) this.cache.set(key, this.scanHealthy(scanText(text)));
        const result = await this.render(this.cache.get(key)!, ctx);
        // replace line breaks duplicated by a single line break
        return result.replace(/(\r\n|\n|\r){2,}/gm, '\n');
    }
}