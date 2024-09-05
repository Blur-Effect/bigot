import {Types} from "./types";

export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export const commandEmpty: [number, string[]] = [-1, []];

export const commandAliases = {
    [Types.DECORATOR]: '@',
    [Types.DECORATOR_END]: '@end',
    [Types.FUNCTION]: '#'
};