export default function useUrlParams() {
  return {
    hash: new URLSearchParams(window.location.search)
      .getAll('hash')
      ?.toString(),
  };
}
