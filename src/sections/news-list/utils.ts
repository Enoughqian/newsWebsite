export function emptyRows(rowsPerPage: number, arrayLength: number) {
  // 计算当前页的空白行数量
  return Math.max(0, rowsPerPage - arrayLength);
}

export function cleanObject(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value != null && value !== '')
  );
}

export function getToday() {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

export function getLastToday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 格式化为 YYYY-MM-DD
  const formattedDate = yesterday.toISOString().split('T')[0];
  return formattedDate;
}
