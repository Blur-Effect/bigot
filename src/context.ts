import { AsyncFunction } from "./constants";

export async function get(obj: Record<string, any>, path: string) {
    let base = obj;
    let keys = path.split('.');

    for (let i = 0; i < keys.length; i++) {
        base = base[keys[i]];
        // if base is a function we execute it
        if (base instanceof Function) {
            // if is an async function we await it
            if (base instanceof AsyncFunction) base = await base();
            else base = base();
        }
    }

    return base;
}

export async function applyArgs(args: string[], context: Record<string, any>) {
    const resultArgs: any[] = [];

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

        resultArgs.push(await get(context, args[i]));
    }

    return resultArgs;
}
