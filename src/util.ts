export function hexify(value: number, length_16?: boolean) {
  return `0x${value
    .toString(16)
    .toUpperCase()
    .padStart(length_16 ? 4 : 2, '0')}`
}
