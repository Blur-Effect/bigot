import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Bigot } from "../src";

const aliases: Record<string, string> = {
    'base': 'tests/template-example/base',
    'base-extended': 'tests/template-example/base-extended',
    'list': 'tests/template-example/list',
    'stress1': 'tests/template-example/stress1'
}

const templates: Record<string, string> = {
    'tests/template-example/base': loadAlias('base'),
    'tests/template-example/base-extended': loadAlias('base-extended'),
    'tests/template-example/list': loadAlias('list'),
    'tests/template-example/stress1': loadAlias('stress1')
}

function loadAlias(alias: string) {
    return readFileSync(join(process.cwd(), aliases[alias]), 'utf-8').trim();
}

function getTemplate(alias: string) {
    return templates[aliases[alias]];
}

const bigot = new Bigot();

bigot.registerFunctions('import', async (path: string, { context }: any) => {
    return bigot.compile(path, readFileSync(join(process.cwd(), path), 'utf-8'), context);
});

bigot.registerDecorator('for', async (list: number[], { render }: { render: Function }) => {
    return Promise.all(list.map(async (item, i) => render({ index: i, value: item }))).then((items) => {
        return items.join('')
    })
});

test('render template base' , async () => {
    const result = await bigot.compile('base', getTemplate('base'), {});

    expect(result).toMatch('This is a base for the templates');
});

test('render template base extended' , async () => {
    const result = await bigot.compile('base-extended', getTemplate('base-extended'), {});

    expect(result).toMatch('This is a base for the templates');
    expect(result).toMatch('This extends the base');
});

test('render template list' , async () => {
    const result = await bigot.compile('list', getTemplate('list'), { list: ['a', 'b', 'c'] });

    expect(result).toMatch('0: a\n1: b\n2: c');
});

test('render template stress1' , async () => {
    const result = await bigot.compile('stress1', getTemplate('stress1'), { data: { value: '@@value@@' } });

    expect(result).toMatch('@@value@@');
});
