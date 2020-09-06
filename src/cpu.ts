import { Memory } from './memory'
import { OpCode } from './op-code'
import { hexify } from './util'

export enum Registers {
  IP,
  ACC,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
}

const REGISTER_NAMES = ['ip', 'acc', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6']

export class CPU {
  private registers: DataView

  constructor(private memory: Memory) {
    this.registers = Memory.createMemory(REGISTER_NAMES.length * 2)
  }

  private setRegister(register: Registers, value: number): void {
    this.registers.setUint16(register * 2, value)
  }

  private getRegister(register_id: Registers): number {
    return this.registers.getUint16(register_id * 2)
  }

  public log(): void {
    const ip_location = this.getRegister(Registers.IP)

    console.log(
      new Uint8Array(10)
        .map((_, index) => this.memory.loadByte(ip_location + index))
        .reduce(
          (prev, curr) => prev + hexify(curr) + ' ',
          ip_location === 0 ? '' : '... ',
        ),
    )

    console.log('  ^'.padStart(ip_location === 0 ? 0 : 7, ' '), '\n')

    REGISTER_NAMES.forEach((register_name, index) => {
      const value = this.registers.getUint16(index * 2)
      console.log(
        `${register_name.padEnd(4, ' ')}: ${hexify(
          value,
          true,
        )} [ ${value.toString().padStart(5, ' ')} ]`,
      )
    })

    console.log()
  }

  public fetch(length_16?: boolean): number {
    const instruction_index = this.getRegister(Registers.IP)
    const instruction = length_16
      ? this.memory.load16(instruction_index)
      : this.memory.loadByte(instruction_index)
    this.setRegister(Registers.IP, instruction_index + (length_16 ? 2 : 1))
    return instruction
  }

  public fetch16(): number {
    return this.fetch(true)
  }

  public decodeExec(instruction: OpCode): void {
    switch (instruction) {
      /* Perform an arithmetic ADD operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCode.ADD_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.setRegister(
          Registers.ACC,
          this.getRegister(reg_1) + this.getRegister(reg_2),
        )
        break
      }

      /* Perform a logical AND operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCode.AND_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.setRegister(
          Registers.ACC,
          this.getRegister(reg_1) & this.getRegister(reg_2),
        )
        break
      }

      /* Store a literal value inside a given register */
      case OpCode.MOV_LITERAL_TO_REG: {
        const literal: number = this.fetch16()
        this.setRegister(this.fetch() as Registers, literal)
        break
      }

      /* Store the value contained in a memory location into a
       * register */
      case OpCode.MOV_MEM_TO_REG: {
        const address: number = this.fetch16()
        const register: Registers = this.fetch()
        this.setRegister(register, this.memory.load16(address))
        break
      }

      /* Store the value contained in a register into a memory
       * location */
      case OpCode.MOV_REG_TO_MEM: {
        const register: Registers = this.fetch()
        const address: number = this.fetch16()
        this.memory.store16(address, this.getRegister(register))
        break
      }

      /* Store the value contained in a register inside a different
       * register */
      case OpCode.MOV_REG_TO_REG: {
        const source_register: Registers = this.fetch()
        this.setRegister(
          this.fetch() as Registers,
          this.getRegister(source_register),
        )
        break
      }

      /* Perform a logical OR operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCode.OR_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.setRegister(
          Registers.ACC,
          this.getRegister(reg_1) | this.getRegister(reg_2),
        )
        break
      }

      // Do nothing
      case OpCode.NO_OP:
      default:
        break
    }
  }

  public step(): void {
    const instruction: OpCode = this.fetch()
    this.decodeExec(instruction)
  }
}
