import { Memory } from './memory'
import { OpCodes } from './op_codes'
import { hexify } from './util'

export enum Registers {
  IP = 0x00,
  ACC = 0x01,
  R1 = 0x02,
  R2 = 0x03,
  R3 = 0x04,
  R4 = 0x05,
  R5 = 0x06,
  R6 = 0x07,
}

const REGISTER_NAMES = ['ip', 'acc', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6']

export class CPU {
  private registers: DataView

  constructor(private memory: Memory) {
    this.registers = Memory.createMemory(REGISTER_NAMES.length * 2)
  }

  private set_register(register: Registers, value: number): void {
    this.registers.setUint16(register * 2, value)
  }

  private get_register(register_id: Registers): number {
    return this.registers.getUint16(register_id * 2)
  }

  public log(): void {
    const ip_location = this.get_register(Registers.IP)

    console.log(
      new Uint8Array(10)
        .map((_, index) => this.memory.load_byte(ip_location + index))
        .reduce(
          (prev, curr) => prev + hexify(curr) + ' ',
          ip_location === 0 ? '' : '... '
        )
    )

    console.log('  ^'.padStart(ip_location === 0 ? 0 : 7, ' '), '\n')

    REGISTER_NAMES.forEach((register_name, index) => {
      const value = this.registers.getUint16(index * 2)
      console.log(
        `${register_name.padEnd(4, ' ')}: ${hexify(
          value,
          true
        )} [ ${value.toString().padStart(5, ' ')} ]`
      )
    })

    console.log()
  }

  public fetch(length_16?: boolean): number {
    const instruction_index = this.get_register(Registers.IP)
    const instruction = length_16
      ? this.memory.load_16(instruction_index)
      : this.memory.load_byte(instruction_index)
    this.set_register(Registers.IP, instruction_index + (length_16 ? 2 : 1))
    return instruction
  }

  public fetch_16(): number {
    return this.fetch(true)
  }

  public decode_execute(instruction: OpCodes): void {
    switch (instruction) {
      /* Perform an arithmetic ADD operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCodes.ADD_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.set_register(
          Registers.ACC,
          this.get_register(reg_1) + this.get_register(reg_2)
        )
        break
      }

      /* Perform a logical AND operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCodes.AND_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.set_register(
          Registers.ACC,
          this.get_register(reg_1) & this.get_register(reg_2)
        )
        break
      }

      /* Store a literal value inside a given register */
      case OpCodes.MOV_LITERAL_TO_REG: {
        const literal: number = this.fetch_16()
        this.set_register(this.fetch() as Registers, literal)
        break
      }

      /* Store the value contained in a register inside a different
       * register */
      case OpCodes.MOV_REG_TO_REG: {
        const source_register: Registers = this.fetch()
        this.set_register(
          this.fetch() as Registers,
          this.get_register(source_register)
        )
        break
      }

      /* Perform a logical OR operation on the contents of the
       * registers provided and store the result in the accumulator */
      case OpCodes.OR_REG_TO_REG: {
        const reg_1: Registers = this.fetch()
        const reg_2: Registers = this.fetch()
        this.set_register(
          Registers.ACC,
          this.get_register(reg_1) | this.get_register(reg_2)
        )
        break
      }

      // Do nothing
      case OpCodes.NO_OP:
      default:
        break
    }
  }

  public step(): void {
    const instruction: OpCodes = this.fetch()
    this.decode_execute(instruction)
  }
}
