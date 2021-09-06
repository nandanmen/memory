import { createMemory, Pointer } from '../src';

describe('Memory', () => {
  describe('get', () => {
    describe('allocated', () => {
      it('fetches the value', () => {
        const memory = createMemory([{ allocated: true, value: 1 }]);
        const pointer = new Pointer(0, 1, 1);
        expect(memory.get(pointer)).toEqual(1);
      });
    });

    describe('types > 1 byte', () => {
      it('fetches the value at the end', () => {
        const memory = createMemory([
          { allocated: true, value: null },
          { allocated: true, value: 12 },
        ]);
        const pointer = new Pointer(0, 1, 2);
        expect(memory.get(pointer)).toEqual(12);
      });
    });

    describe('partially unallocated', () => {
      it('throws an error', () => {
        const memory = createMemory([
          { allocated: false, value: null },
          { allocated: true, value: 12 },
        ]);
        const pointer = new Pointer(0, 1, 2);
        expect(() => memory.get(pointer)).toThrowErrorMatchingInlineSnapshot(
          `"Invalid memory access at pointer: {\\"address\\":0,\\"blockSize\\":1,\\"typeSize\\":2}"`
        );
      });
    });
  });

  describe('set', () => {
    it("sets the value and the pointer's type size", () => {
      const memory = createMemory([{ allocated: true, value: null }]);
      const pointer = new Pointer(0, 1, 0);
      memory.set(pointer, 'a');

      expect(pointer.typeSize).toEqual(1);
      expect(memory.contents[0].value).toEqual('a');
    });
  });

  describe('allocate', () => {});

  describe('free', () => {});
});
