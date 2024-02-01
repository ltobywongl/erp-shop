export function toPrice(money: number) {
  return insertAt(money * 100 + "", ".", -2);
}

export function insertAt(target: string, toInsert: string, position: number) {
  if (position < 0) position = target.length + position;
  return target.substring(0, position) + toInsert + target.substring(position);
}
