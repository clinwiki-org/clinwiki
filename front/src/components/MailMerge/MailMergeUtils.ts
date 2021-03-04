export function getStudyQuery(name: string, frag: string) {
  frag = frag || `fragment ${name} on Study { nctId }`;
  return `
  query Study${name}Query($nctId: String!) {
    study(nctId: $nctId) {
      nctId
      ...${name}
    }
  }
  ${frag}
`;
}

export function getSearchQuery(name: string, frag: string) {
  frag = frag || `fragment ${name} on ElasticStudy { nctId }`;
  return `
  query Search${name}Query($hash:String) {
    search(searchHash: $hash) {
      studies {
        averageRating
        ...${name}
      }
      recordsTotal
    }
  }
  ${frag}
  `;
}
