# Implementation Notes

Setting and getting a number from memory:

```js
const memory = createMemory();

const number = memory.allocate(8); // number is a void pointer here

memory.get(number); // doesn't work -- should it throw an error?

memory.set(number, 12); // set data at `number` to 12, also set pointer type to number

memory.get(number); // returns 12
```

Strings are handled as arrays, so you can't set it directly. Instead, you have to iterate through the string and set individual characters:

```js
const memory = createMemory();

// allocate space for a 5 character word
const word = memory.allocate(5);

memory.get(word); // doesn't work

[...'hello'].forEach((char, index) => {
  memory.set(word.address + index, char);
});

memory.get(word); // returns "h" instead of the whole word
```
