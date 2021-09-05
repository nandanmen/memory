export type Value = number | string | boolean;

export type Block = {
  value: Value;
  allocated: boolean;
};

export type Pointer = {
  /**
   * Size of the associated allocated block.
   */
  blockSize: number;
  /**
   * Size of the _type_ of data that the pointer is pointing to.
   */
  typeSize: number;
  address: number;
};

export interface Memory {
  contents: Block[];
  get(pointer: Pointer): Value;
  set(pointer: Pointer, value: Value): void;
  allocate(bytes: number): Pointer;
  free(pointer: Pointer): void;
}
