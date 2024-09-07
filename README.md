# Bigot
### _template engine inspired by mustache_
---
Inspired by Mustache, this template engine seeks to add support for asynchronous operations in a simple way within context, functions, and decorators.

## Usage

### context

```js
import { Bigot } from "@blureffect/bigot";

const bigot = new Bigot();

const result = await bigot.compile('context', '{{ data.user.id }}', { data: { user: { id: 1 } } });
const result = await bigot.compile('context', '{{ data.user.id }}', { data: { user: { id: () => 1 } } });
const result = await bigot.compile('context', '{{ data.user.id }}', { data: { user: { id: async (ctx) => 1 } } });
const result = await bigot.compile('context', '{{ data.user.id }}', { data: { user: async (ctx) => ({ id: 1 }) } });
```

### functions

```js
import { Bigot } from "@blureffect/bigot";

const bigot = new Bigot();

bigot.registerFunctions('now', () => new Date().toISOString());
bigot.registerFunctions('sum', (arg1: number, arg2: number) => arg1 + arg2);

const result = await bigot.compile('function_now', '{{#now}}', {});
const result = await bigot.compile('function_sum', '{{#sum 1 arg2}}', { arg2: 2 });
```

### decorators

```js
import { Bigot } from "@blureffect/bigot";

const bigot = new Bigot();

bigot.registerDecorator('for', async (list: number[], { render }: { render: Function }) => {
    return Promise.all(list.map(async (item, i) => render({ index: i, value: item }))).then((items) => {
        return items.join('')
    })
});

const result = await bigot.compile('list', getTemplate('list'), { list: ['a', 'b', 'c'] });
```

template/list

```
list
{{@for list}}
{{index}}: {{value}}
{{@end}}
```

---
The `compile` function receives a key, the template and the context. The key will be used to store the template once it has been analyzed and to make it faster in its next execution.

## License

MIT
