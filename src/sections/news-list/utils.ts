export function emptyRows(rowsPerPage: number, arrayLength: number) {
  // 计算当前页的空白行数量
  return Math.max(0, rowsPerPage - arrayLength)
}

export function cleanObject(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value != null && value !== '')
  );
};
