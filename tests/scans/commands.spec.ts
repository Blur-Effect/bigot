import { test, expect } from '@playwright/test';
import { scanCommand } from "../../src/scans";
import { Types } from "../../src/types";

test('Identifies functions', () => {
    const [_, command] = scanCommand('{{#data}}', 0);

    expect(command[0]).toBe(Types.FUNCTION);
    expect(command[1]).toBe('data');
});

test('Identifies decorators', () => {
    const [_, command] = scanCommand('{{@data}}', 0);

    expect(command[0]).toBe(Types.DECORATOR);
    expect(command[1]).toBe('data');
});

test('Arguments can be passed to a function or a decorator.', () => {
    const [_1, command1] = scanCommand('{{#data \'id\' 1 item}}', 0);
    const [_2, command2] = scanCommand('{{@data \'id\' 1 item}}', 0);

    expect(command1[2]).toBe("'id'");
    expect(command1[3]).toBe("1");
    expect(command1[4]).toBe("item");

    expect(command2[2]).toBe("'id'");
    expect(command2[3]).toBe("1");
    expect(command2[4]).toBe("item");
});

test('A string can have multiple spaces.', () => {
    const [_1, command1] = scanCommand('{{#data "This is a test argument"}}', 0);
    const [_2, command2] = scanCommand('{{#data "This  is   a    test argument"}}', 0);

    expect(command1[2]).toBe('"This is a test argument"')
    expect(command2[2]).toBe('"This  is   a    test argument"')
});

test('Identifies when a decorator ends', () => {
    const [_, command] = scanCommand('{{@end}}', 0);

    expect(command[0]).toBe(Types.DECORATOR_END);
});

test('Identifies objects', () => {
    const [_, command] = scanCommand('{{data.user.id}}', 0);

    expect(command[0]).toBe(Types.OBJECT);
    expect(command[1]).toBe('data.user.id');
});

test('Objects can have spaces', () => {
    const [_, command] = scanCommand('{{ data.user.firebase token.value    }}', 0);

    expect(command[0]).toBe(Types.OBJECT);
    expect(command[1]).toBe('data.user.firebase token.value');
})
