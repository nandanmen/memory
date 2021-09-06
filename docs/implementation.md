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

## Type Size

A type size represents the size, in bytes, of an individual type. There are four valid types:

- Number -> 8 bytes
- Boolean -> 1 byte
- Char -> 1 byte
- Box -> 9 bytes

The "box" type is a variable-typed container that's 9 bytes long (1 byte for the tag, 8 for the value).

## How to store numbers?

The simplest way to design pointers is to treat them as addresses:

- Retrieving the value of a pointer would be to read from the address the pointer is associated with
- Setting a value of a pointer would be to set at the given address, nothing more

If a pointer has type information, we would modify this as follows:

- Retrieving the value of a pointer would be to read the entire block where the block size = `sizeof(value)`
- Setting the value of a pointer would set the entire block as well

At this point, pointers no longer associate with a single address; rather they associate with whole blocks where the block is as large as the value that the pointer points to.
