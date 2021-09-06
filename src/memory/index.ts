import type { Block, Memory, Value } from './memory.types';
import { Pointer } from './pointer';

export { Pointer } from './pointer';

const TYPE_SIZE_MAP = {
  string: 1,
  boolean: 1,
  number: 8
} as Record<string, number>;

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
			return getFromAddress(contents, pointer.valueAddress())
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
      pointer.typeSize = getTypeSize(value);
      contents = setAtAddress(contents,  pointer.valueAddress(), value)
    },
    allocate: (bytes) => {
      // TODO
      return new Pointer(0, bytes, 0);
    },
    free: (pointer) => {
      // TODO
      console.log(pointer);
    },
  };
};

function getFromAddress(blocks: Block[], address: number) {
  const block = blocks[address];
  return block?.value;
}

function setAtAddress(blocks: Block[], address: number, value: Value) {
  const block = blocks[address];
  if (block) {
    block.value = value;
  }
  return blocks;
}

function getTypeSize(value: Value) {
  const key = typeof value as string;
  return TYPE_SIZE_MAP[key];
}

/**
 * Access to a pointer is valid if every address within `typeSize` is valid
 */
function isValidAccess(blocks: Block[], pointer: Pointer) {
  return range(pointer.typeSize).every(offset => blocks[pointer.address + offset]?.allocated);
}

function assertValidAccess(blocks: Block[], pointer: Pointer) {
  if (!isValidAccess(blocks, pointer)) {
    throw new Error(`Invalid memory access at pointer: ${JSON.stringify(pointer)}`)
  }
}

function range(number: number): number[] {
  return Array.from({ length: number }).fill(-1).map((_, index) => index);
}
