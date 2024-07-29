export function toPrice(money: number) {
  return insertAt(money * 100 + "", ".", -2);
}

export function insertAt(target: string, toInsert: string, position: number) {
  if (position < 0) position = target.length + position;
  return target.substring(0, position) + toInsert + target.substring(position);
}

export function pathToS3Url(path: string) {
  if (path.startsWith("http") || path === "/images/fallback.png") return path;
  const timeStamp = new Date().getTime();
  return `https://erp-shop-public.s3.ap-northeast-1.amazonaws.com/${path}?timeStamp=${timeStamp}`;
}
