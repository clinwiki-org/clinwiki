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
  frag = frag || `fragment ${name} on  ElasticStudy { nctId }`;
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
export function getSearchQueryDIS(name: string, frag: string) {
  frag = frag || `fragment ${name} on ElasticStudyDIS { conditionId }`;
  return `
  query Search${name}QueryDIS($params:SearchInput!) {
    searchDIS(params: $params) {
      diseases {
        conditionId
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
export function getHasuraStudyQueryDIS(name: string, frag: string) {
  frag = frag || `fragment ${name} on disyii2_prod_20210704_2_tbl_conditions{condition_id}`;
  return `
  query disyii2_prod_20210704_2_tbl_conditions${name}Query($conditionId: bigint) {
    disyii2_prod_20210704_2_tbl_conditions(where: {condition_id: {_eq: $conditionId}}) {
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
  ctgov_prod_studies(where: {nct_id: {_eq: $nctId}}){
      nct_id
      brief_title
  }
}
`;
 */
