import * as readline from 'readline'
import { CPU, Registers } from './cpu'
import { Memory } from './memory'
import { OpCodes } from './op_codes'

const memory: Memory = new Memory(1024 * 1024)

// Store 00AB inside Register r1
memory.push_byte(OpCodes.MOV_LITERAL_TO_REG)
memory.push_byte(0x00)
memory.push_byte(0xab)
memory.push_byte(Registers.R1)

// Store 34FA inside Register r2
memory.push_byte(OpCodes.MOV_LITERAL_TO_REG)
memory.push_byte(0x34)
memory.push_byte(0xfa)
memory.push_byte(Registers.R2)

// Add values in r1 and r2 and store in acc
memory.push_byte(OpCodes.ADD_REG_TO_REG)
memory.push_byte(Registers.R1)
memory.push_byte(Registers.R2)

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