import {commandAliases, commandEmpty} from "./constants";
import {Types} from "./types";

export function scanCommand(text: string, index: number): [number, string[]] {
    const startCommand = text[index] === '{' && text[index+1] === '{';
    if (!startCommand) return commandEmpty;

    const startIndex = index + 2;
    const endIndex = text.indexOf('}}', startIndex);
    if (endIndex < startIndex + 2) return commandEmpty;

    const raw = text.substring(startIndex, endIndex).trim();
    const command: string[] = [];

    if (raw === commandAliases[Types.DECORATOR_END]) command.push(Types.DECORATOR_END);
    else if (raw[0] === commandAliases[Types.DECORATOR]) command.push(Types.DECORATOR);
    else if (raw[0] === commandAliases[Types.FUNCTION]) command.push(Types.FUNCTION);
    else command.push(Types.OBJECT);

    if (command[0] === Types.DECORATOR || command[0] === Types.FUNCTION) {
        command.push(...raw.substring(1).trim().split(/\s+(?=(?:[^"']*["'][^"']*["'])*[^"']*$)+/g));
    }

    if (command[0] === Types.OBJECT) {
        command.push(raw);
    }

    return [endIndex + 2, command];
}

export function scanText(text: string) {
    let result: string[][] = [];
    for (let index = 0; index < text.length; index++) {
        const [newIndex, cmd] = scanCommand(text, index);
        if (newIndex > index) {
            index = newIndex;
            result.push(cmd);
            if (text[index]) result.push([Types.TEXT, '']);
        }

        if (!result.length) result.push([Types.TEXT, text[index]]);
        else if (text[index]) result[result.length - 1][1] += text[index];
    }

    return result;
}