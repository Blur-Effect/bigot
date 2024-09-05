import {readFileSync} from "fs";
import {join} from "path";
import {Bigot} from "./index";

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
    return readFileSync(join(process.cwd(), '..', aliases[alias]), 'utf-8').trim();
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

console.time('bigot');
bigot.compile('stress1', getTemplate('stress1'), { data: { value: '@@value@@' } })
    .then((result) => {
        console.timeEnd('bigot');
    });

console.time('bigot2');
bigot.compile('stress1', getTemplate('stress1'), { data: { value: '@@value@@' } })
    .then((result) => {
        console.timeEnd('bigot2');
    });