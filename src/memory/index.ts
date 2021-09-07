import { Block, Memory, Value } from './memory.types';
import { Pointer } from './pointer';

export { Pointer } from './pointer';

const TYPE_SIZE_MAP = {
  string: 1,
  boolean: 1,
  number: 8,
} as Record<string, number>;

export const createMemory = (data: Block[] = []): Memory => {
  let contents = [...data];
  return {
    contents: () => contents,
    get: pointer => {
      assertValidAccess(contents, pointer);
      return getFromAddress(contents, pointer.valueAddress());
    },
    set: (pointer, value) => {
      assertValidAccess(contents, pointer);
      pointer.typeSize = getTypeSize(value);
      contents = setAtAddress(contents, pointer.valueAddress(), value);
    },
    allocate: bytes => {
      let address = findAvailableAddress(contents, bytes);
      if (address === null) {
        address = contents.length;
        contents = resize(contents, Math.max(contents.length * 2, bytes));
      }
      contents = allocate(contents, address, bytes);
      return new Pointer(address, bytes, 0);
    },
    free: pointer => {
      // TODO
      console.log(pointer);
    },
  };
};

// --

function allocate(blocks: Block[], startingAddress: number, size: number) {
  range(size).forEach(offset => {
    blocks[startingAddress + offset].allocated = true;
  });
  return blocks;
}

function findAvailableAddress(blocks: Block[], size: number) {
  for (const address of blocks.keys()) {
    if (allFree(blocks, address, size)) {
      return address;
    }
  }
  return null;
}

function allFree(blocks: Block[], startingAddress: number, size: number) {
  return range(size).every(
    offset => !blocks[startingAddress + offset].allocated
  );
}

function resize(blocks: Block[], newLength: number) {
  const newBlocks = range(newLength).map(() => ({
    allocated: false,
    value: null,
  }));
  return [...blocks, ...newBlocks];
}

// --

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
  return range(pointer.typeSize).every(
    offset => blocks[pointer.address + offset]?.allocated
  );
}

function assertValidAccess(blocks: Block[], pointer: Pointer) {
  if (!isValidAccess(blocks, pointer)) {
    throw new Error(
      `Invalid memory access at pointer: ${JSON.stringify(pointer)}`
    );
  }
}

function range(number: number): number[] {
  return Array.from({ length: number })
    .fill(-1)
    .map((_, index) => index);
}
