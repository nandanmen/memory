import { createMemory, Pointer } from '../src';

describe('Memory', () => {
  describe('get', () => {
    describe('allocated', () => {
      it('fetches the value', () => {
        const memory = createMemory([{ allocated: true, value: 1 }]);
        const pointer = new Pointer({ address: 0, blockSize: 1, typeSize: 1 });
        expect(memory.get(pointer)).toEqual(1);
      });
    });

    describe('type size > 1 byte', () => {
      it('fetches the value at the end', () => {
        const memory = createMemory([
          { allocated: true, value: null },
          { allocated: true, value: 12 },
        ]);
        const pointer = new Pointer({ address: 0, blockSize: 1, typeSize: 2 });
        expect(memory.get(pointer)).toEqual(12);
      });
    });

    describe('partially unallocated', () => {
      it('throws an error', () => {
        const memory = createMemory([
          { allocated: false, value: null },
          { allocated: true, value: 12 },
        ]);
        const pointer = new Pointer({ address: 0, blockSize: 1, typeSize: 2 });
        expect(() => memory.get(pointer)).toThrowErrorMatchingInlineSnapshot(
          `"Invalid memory access at pointer: {\\"address\\":0,\\"blockSize\\":1,\\"typeSize\\":2}"`
        );
      });
    });
  });

  describe('set', () => {
    it("sets the value and the pointer's type size", () => {
      const memory = createMemory([{ allocated: true, value: null }]);
      const pointer = new Pointer({ address: 0, blockSize: 1, typeSize: 0 });
      memory.set(pointer, 'a');

      expect(pointer.typeSize).toEqual(1);
      expect(memory.contents()[0].value).toEqual('a');
    });
  });

  describe('allocate', () => {
    it('allocates memory in existing blocks', () => {
      const memory = createMemory([
        { allocated: true, value: 'c' },
        { allocated: false, value: null },
        { allocated: false, value: null },
        { allocated: true, value: 'a' },
      ]);
      const result = memory.allocate(2);
      expect(result).toEqual(
        new Pointer({ address: 1, blockSize: 2, typeSize: 0 })
      );

      memory.contents().forEach(block => expect(block.allocated).toBeTruthy());
    });

    it("expands memory when there's no space", () => {
      const memory = createMemory();
      const result = memory.allocate(2);

      expect(result).toEqual(
        new Pointer({ address: 0, blockSize: 2, typeSize: 0 })
      );

      const blocks = memory.contents();
      expect(blocks).toHaveLength(2);
      blocks.forEach(block => expect(block.allocated).toBeTruthy());
    });
  });

  describe('free', () => {
    it('deallocates all blocks pointed by the pointer', () => {
      const memory = createMemory([
        { allocated: true, value: 'a' },
        { allocated: true, value: 'b' },
        { allocated: true, value: 'c' },
      ]);

      memory.free(new Pointer({ address: 0, blockSize: 3, typeSize: 1 }));
      memory.contents().forEach(block => expect(block.allocated).toBeFalsy());
    });
  });
});
