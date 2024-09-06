"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCommand = scanCommand;
exports.scanText = scanText;
const constants_1 = require("./constants");
const types_1 = require("./types");
function scanCommand(text, index) {
    const startCommand = text[index] === '{' && text[index + 1] === '{';
    if (!startCommand)
        return constants_1.commandEmpty;
    const startIndex = index + 2;
    const endIndex = text.indexOf('}}', startIndex);
    if (endIndex < startIndex + 2)
        return constants_1.commandEmpty;
    const raw = text.substring(startIndex, endIndex).trim();
    const command = [];
    if (raw === constants_1.commandAliases[types_1.Types.DECORATOR_END])
        command.push(types_1.Types.DECORATOR_END);
    else if (raw[0] === constants_1.commandAliases[types_1.Types.DECORATOR])
        command.push(types_1.Types.DECORATOR);
    else if (raw[0] === constants_1.commandAliases[types_1.Types.FUNCTION])
        command.push(types_1.Types.FUNCTION);
    else
        command.push(types_1.Types.OBJECT);
    if (command[0] === types_1.Types.DECORATOR || command[0] === types_1.Types.FUNCTION) {
        command.push(...raw.substring(1).trim().split(/\s+(?=(?:[^"']*["'][^"']*["'])*[^"']*$)+/g));
    }
    if (command[0] === types_1.Types.OBJECT) {
        command.push(raw);
    }
    return [endIndex + 2, command];
}
function scanText(text) {
    let result = [];
    for (let index = 0; index < text.length; index++) {
        const [newIndex, cmd] = scanCommand(text, index);
        if (newIndex > index) {
            index = newIndex;
            result.push(cmd);
            if (text[index])
                result.push([types_1.Types.TEXT, '']);
        }
        if (!result.length)
            result.push([types_1.Types.TEXT, text[index]]);
        else if (text[index])
            result[result.length - 1][1] += text[index];
    }
    return result;
}
