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
    this.pointer = 0
    this.MAX_OFFSET = n_bytes
    this.memory = Memory.createMemory(n_bytes)
  }

  public loadByte(address: number): number {
    if (address > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    return this.memory.getUint8(address)
  }

  public load16(address: number): number {
    if (address + 1 > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    return this.memory.getUint16(address)
  }

  public storeByte(address: number, value: number): void {
    if (address > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    this.memory.setUint8(address, value)
  }

  public store16(address: number, value: number): void {
    if (address + 1 > this.MAX_OFFSET) {
      throw new OutOfBoundsException()
    }

    this.memory.setUint16(address, value)
  }

  public pushByte(value: number): void {
    this.storeByte(this.pointer++, value)
  }

  public push16(value: number): void {
    this.store16(this.pointer, value)
    this.pointer += 2
  }
}
