export default function useUrlParams() {
  return {
    hash: new URLSearchParams(window.location.search)
      .getAll('hash')
      ?.toString(),
    sv: new URLSearchParams(window.location.search)
      .getAll('sv')
      ?.toString(),
    pv: new URLSearchParams(window.location.search)
      .getAll('pv')
      ?.toString(),  
    q: new URLSearchParams(window.location.search)
      .getAll('q')
      ?.toString(),

  };
}
