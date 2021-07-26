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
  query Search${name}Query($params:SearchInput!) {
    search(params: $params) {
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

const camelToSnakeCase = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export function getHasuraStudyQuery(name: string, frag: string) {
  frag = frag || `fragment ${name} on ctgov_prod_studies{nct_id}`;
  return `
  query ctgov_prod_studies${name}Query($nctId: String!) {
    ctgov_prod_studies(where: {nct_id: {_eq: $nctId}}) {
      ...${name}
    }
  }
  ${frag}
`;
}

export const getSampleStudyQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on Study { nctId }`;
  return `
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;
};

export const getHasuraSampleStudyQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on ctgov_prod_studies{nct_id}`;
  return `
query HasuraSampleStudyQuery($nctId: String!) {
  ctgov_prod_studies(where: {nct_id: {_eq: $nctId}}) {
    ...${name}
  }
}
${frag}
`;
};

//nctId  wont work, need snake cased  nct_id

/* const HASURA_STUDY_QUERY = `query hasuraStudyQuery($nctId:String!) {
  ctgov_studies(where: {nct_id: {_eq: $nctId}}){
      nct_id
      brief_title
  }
}
`;
 */
