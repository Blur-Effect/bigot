import { test, expect } from '@playwright/test';
import { scanText } from "../../src/scans";
import { Types } from "../../src/types";

test('a text command must return', () => {
    const [command] = scanText("test");

    expect(command[0]).toEqual(Types.TEXT);
    expect(command[1]).toEqual("test");
});

test("The text can include the \"function\" command", () => {
    const [_, command] = scanText("test: {{# myFunction }}");

    expect(command[0]).toEqual(Types.FUNCTION);
    expect(command[1]).toEqual("myFunction");
});

test("The text can include the \"decorator\" command", () => {
    const [_, command] = scanText("test: {{@ myDecorator }}");

    expect(command[0]).toEqual(Types.DECORATOR);
    expect(command[1]).toEqual("myDecorator");
});

test("The text can include the \"end decorator\" command", () => {
    const [_, command] = scanText("test: {{@end}}");

    expect(command[0]).toEqual(Types.DECORATOR_END);
});

test("The text can include the \"object\" command", () => {
    const [_, command] = scanText("test: {{data.value}}");

    expect(command[0]).toEqual(Types.OBJECT);
    expect(command[1]).toEqual("data.value");
});

test("The text can have multiple interspersed commands", () => {
    const scan = scanText("test {{#func}} test {{data.value}} {{@dec}} test {{@end}}");

    expect(scan.length).toBe(8);
    expect(scan[0][0]).toBe(Types.TEXT);
    expect(scan[1][0]).toBe(Types.FUNCTION);
    expect(scan[2][0]).toBe(Types.TEXT);
    expect(scan[3][0]).toBe(Types.OBJECT);
    expect(scan[4][0]).toBe(Types.TEXT);
    expect(scan[5][0]).toBe(Types.DECORATOR);
    expect(scan[6][0]).toBe(Types.TEXT);
    expect(scan[7][0]).toBe(Types.DECORATOR_END);
});
