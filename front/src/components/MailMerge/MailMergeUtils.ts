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

export function getSearchQuery(name: string, frag: string, parentQuery?: string) {
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

export function getMyQuery(name: string, frag: string, schemaName: string, primaryKey: string, pkType:string, endPoint: string, options: string, parentQuery?: string) {
    return frag ?  `
  query My${name}Query${(primaryKey == 'null' ? '{': '($'+primaryKey+':'+pkType+'){')}
    ${endPoint}(${options}) {
      ${(parentQuery && parentQuery !== endPoint )?`${parentQuery}{
        ...${name}
      }`: `...${name}`
     } 
     ${( parentQuery && parentQuery !== endPoint ) ? 'recordsTotal': ''}
    }

  }
  ${frag}
  ` : `
  query My${name}Query($${primaryKey}:${pkType}) {
    ${endPoint}(${options}) {
     ${parentQuery ? 'recordsTotal': ''}
    }

  }`;
}
export function getSearchQueryDIS(name: string, frag: string) {
    frag = frag || `fragment ${name} on ElasticStudyDIS { conditionId }`;
    return `
  query Search${name}QueryDIS($params:SearchInput!) {
    searchDIS(params: $params) {
      diseases {
        ...${name}
      }
      recordsTotal
    }
  }
  ${frag}
  `;
}

export function getSearchNearbyQuery() {
    return `
  query SearchNearbyQuery($params:SearchInput!) {
    search(params: $params) {
      studies {
        nctId
      }
      recordsTotal
    }
  }
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
    frag =
        frag ||
        `fragment ${name} on dis_prod_tbl_conditions{condition_id}`;
    return `
  query dis_prod_tbl_conditions${name}Query($conditionId: bigint) {
    dis_prod_tbl_conditions(where: {condition_id: {_eq: $conditionId}}) {
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
