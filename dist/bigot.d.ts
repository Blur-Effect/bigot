export declare class Bigot {
    protected readonly cache: Map<string, string[][]>;
    protected readonly functions: Map<string, Function>;
    protected readonly decorators: Map<string, Function>;
    registerFunctions(key: string, func: Function): void;
    registerDecorator(key: string, func: Function): void;
    scanHealthy(scan: string[][]): string[][];
    renderDecorator(start: number, scan: string[][], context: Record<string, any>): Promise<[number, string]>;
    renderFunction(scan: string[], context: Record<string, any>): Promise<string>;
    render(scan: string[][], context: Record<string, any>): Promise<string>;
    compile(key: string, text: string, ctx: Record<string, any>): Promise<string>;
}
