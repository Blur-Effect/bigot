import { test, expect } from '@playwright/test';
import { Bigot } from "../src";
import { Types } from "../src/types";

const scanFragment = [
    [Types.DECORATOR, 'list', 'list'],
    [Types.TEXT, 'item '],
    [Types.OBJECT, 'index'],
    [Types.DECORATOR, '!isLast', 'index', 'list'],
    [Types.TEXT, '\n'],
    [Types.DECORATOR_END],
    [Types.DECORATOR_END]
];

test('must call the decorator and render the content' , async () => {
    const bigot = new Bigot();

    bigot.registerDecorator('!isLast', async (index: number, list: number[], { render }: { render: Function }) => {
        if (index < list.length) return render();
    });

    bigot.registerDecorator('list', async (list: number[], { render }: { render: Function }) => {
        return Promise.all(list.map(async (item) => `${item}) ${await render({ index: item })}`)).then((items) => items.join(''))
    });

    const [_, result] = await bigot.renderDecorator(0, scanFragment, { list: [1, 2, 3] });

    expect(result).toBe('1) item 1\n2) item 2\n3) item 3');
});
