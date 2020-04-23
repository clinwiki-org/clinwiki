export function truncateString(
  str: string | null,
  n: number,
  useWordBoundary: boolean
) {
  if (!str || str.length <= n) {
    return str || '';
  }
  let shortStr = str.substr(0, n);
  return (
    (useWordBoundary
      ? shortStr.substr(0, shortStr.lastIndexOf(' '))
      : shortStr) + '...'
  );
}
