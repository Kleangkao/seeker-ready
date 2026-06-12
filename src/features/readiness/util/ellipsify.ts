export function ellipsify(value: string, chars = 4) {
  return value.length > chars * 2 + 3 ? `${value.slice(0, chars)}...${value.slice(-chars)}` : value
}
