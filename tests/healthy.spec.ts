import { test, expect } from '@playwright/test';
import { scanText } from "../src/scans";
import { Bigot } from "../src";


test('You should get an error for not found a decorator', () => {
    const bigot = new Bigot();

    expect(() => bigot.scanHealthy(scanText('{{@dec item}}'))).toThrow('Decorator "dec" not found');
});

test('You should get an error for not found a function', () => {
    const bigot = new Bigot();

    expect(() => bigot.scanHealthy(scanText('{{#func item}}'))).toThrow('Function "func" not found');
});

test('You should get an error for not closing a decorator', () => {
    const bigot = new Bigot();
    bigot.registerDecorator('dec', () => {});

    expect(() => bigot.scanHealthy(scanText('{{@dec item}}'))).toThrow('Decorator: {{@dec item}} is not closed');
});

test('should give an error for not finishing a decorator without having opened it', () => {
    const bigot = new Bigot();

    expect(() => bigot.scanHealthy(scanText('{{@end}}'))).toThrow('Command "{{@end}}" orphan');
});
