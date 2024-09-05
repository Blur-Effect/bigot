import { test, expect } from '@playwright/test';
import { get, applyArgs } from "../src/context";

test('should get the value from the context', async () => {
    const value = await get({ data: { user: { id: 1 } } }, 'data.user.id');
    expect(value).toBe(1);
});

test('should get the value from the context with a function', async () => {
    const value = await get({ data: { user: { id: () => 1 } } }, 'data.user.id');
    expect(value).toBe(1);
});

test('should get the value from the context with an async function', async () => {
    const value = await get({ data: { user: { id: async () => 1 } } }, 'data.user.id');
    expect(value).toBe(1);
});

test('should get the value from the context with a function and a nested object', async () => {
    const value = await get({ data: { user: { id: () => ({ value: 1 }) } } }, 'data.user.id.value');
    expect(value).toBe(1);
});

test('should get the value from the context with a  async function and a nested object', async () => {
    const value = await get({ data: { user: { id: () => ({ value: async () => 1 }) } } }, 'data.user.id.value');
    expect(value).toBe(1);
});

test('Arguments must return primitive values and context values', async () => {
    const context = { data: { user: { id: 'user-id' } } };
    const args = await applyArgs(['1', 'true', 'false', '"double quote"', '\'simple quote\'', 'data.user.id'], context);

    expect(args[0]).toBe(1);
    expect(args[1]).toBe(true);
    expect(args[2]).toBe(false);
    expect(args[3]).toBe('double quote');
    expect(args[4]).toBe('simple quote');
    expect(args[5]).toBe('user-id');
});
