export default function useUrlParams() {
  return {
    hash: new URLSearchParams(window.location.search)
      .getAll('hash')
      ?.toString(),
    siteViewUrl: new URLSearchParams(window.location.search)
      .getAll('sv')
      ?.toString(),
    pageViewUrl: new URLSearchParams(window.location.search)
      .getAll('pv')
      ?.toString(),
  };
}
