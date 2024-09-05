import { test, expect } from '@playwright/test';
import { Bigot } from "../src";
import { Types } from "../src/types";

const scanFragment = [Types.FUNCTION, 'sum', '1', 'num'];

test('must call the function and render the return' , async () => {
    const bigot = new Bigot();
    bigot.registerFunctions('sum', (a: number, b: number) => a + b);
    const result = await bigot.renderFunction(scanFragment, { num: 2 });

    expect(result).toBe('3');
});

test('must call the async function and render the return' , async () => {
    const bigot = new Bigot();
    bigot.registerFunctions('sum', async (a: number, b: number) => a + b);
    const result = await bigot.renderFunction(scanFragment, { num: 2 });

    expect(result).toBe('3');
});
