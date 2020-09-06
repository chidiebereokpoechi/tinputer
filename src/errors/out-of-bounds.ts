export class OutOfBoundsException extends Error {
  constructor() {
    super('Memory location is out of bounds')
  }
}
