import { Pointer } from './pointer';

export type Value = number | string | boolean;

export type Block = {
  value: Value | null;
  allocated: boolean;
};

export interface Memory {
  contents: Block[];
  get(pointer: Pointer): Value | null;
  set(pointer: Pointer, value: Value): void;
  allocate(bytes: number): Pointer;
  free(pointer: Pointer): void;
}
