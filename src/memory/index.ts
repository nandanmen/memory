import type { Block, Memory } from './memory.types';

export const createMemory = (data: Block[] = []): Memory => {
	let contents = [...data];
  return {
		contents,
    /*
    Is it a good idea to only accept pointers here?
			- If I accept a pointer here, the pointer needs to know the data type
				that it's pointing to.
    */
    get: (pointer) => {
      assertValidAccess(contents, pointer);
			return getFromAddress(contents, pointer.address + pointer.typeSize - 1)
    },
    /*
    How would I store a number in memory? If each block = 1 byte, how do I split
    a JS number into 8 blocks?
      - If I'm looking to replicate the behaviour of actual memory, I would
        convert the number into hex and store each hex digit in 1 byte
        - This makes retrieval more complicated because you have to reconstruct
          the number from the hex digits
    */
    set: (pointer, value) => {
      assertValidAccess(contents, pointer);
      contents = setAtAddress(contents, pointer.address + pointer.typeSize - 1, value)
			pointer.typeSize = getTypeSize(value);
    },
    allocate: (bytes) => {
      // TODO
    },
    free: (pointer) => {
      // TODO
    },
  };
};
