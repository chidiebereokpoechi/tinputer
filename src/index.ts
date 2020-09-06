import * as readline from 'readline'
import { CPU, Registers } from './cpu'
import { Memory } from './memory'
import { OpCode } from './op-code'

const memory: Memory = new Memory(Math.pow(2, 16))

// Store 00AB inside Register r1
memory.pushByte(OpCode.MOV_LITERAL_TO_REG)
memory.pushByte(0x00)
memory.pushByte(0xab)
memory.pushByte(Registers.R1)

// Store 34FA inside Register r2
memory.pushByte(OpCode.MOV_LITERAL_TO_REG)
memory.pushByte(0x34)
memory.pushByte(0xfa)
memory.pushByte(Registers.R2)

// Add values in r1 and r2 and store in acc
memory.pushByte(OpCode.ADD_REG_TO_REG)
memory.pushByte(Registers.R1)
memory.pushByte(Registers.R2)

// Set value at memory location to 0x3456
memory.store16(0x1023, 0x4566)

// Move value at memory location 0x1023 into r4
memory.pushByte(OpCode.MOV_MEM_TO_REG)
memory.pushByte(0x10)
memory.pushByte(0x23)
memory.pushByte(Registers.R4)

const computer: CPU = new CPU(memory)

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function log_dump() {
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  computer.log()
}

log_dump()

prompt.on('line', () => {
  computer.step()
  log_dump()
})

process.on('exit', () => {
  console.log('Exiting...')
  process.exit(0)
})
