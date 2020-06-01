import { OutOfBoundsException } from './errors'

export class Memory {
  public static createMemory(n_bytes: number): DataView {
    const array_buffer: ArrayBuffer = new ArrayBuffer(n_bytes)
    return new DataView(array_buffer)
  }

  public pointer: number
  public memory: DataView
  public MAX_OFFSET: number

  constructor(n_bytes: number) {
    this.pointer = -1
    this.MAX_OFFSET = n_bytes
    this.memory = Memory.createMemory(n_bytes)
  }

  public load_byte(address: number): number {
    if (address > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    return this.memory.getUint8(address)
  }

  public load_16(address: number): number {
    if (address + 1 > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    return this.memory.getUint16(address)
  }

  public store_byte(address: number, byte: number): void {
    if (address > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    this.memory.setUint8(address, byte)
  }

  public push_byte(byte: number): void {
    this.store_byte(++this.pointer, byte)
  }
}
