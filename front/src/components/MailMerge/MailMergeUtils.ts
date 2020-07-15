import { gql } from 'apollo-boost';

export function getStudyQuery(name: string, frag: string) {
  frag = frag || `fragment ${name} on Study { nctId }`;
  return gql`
  query Study${name}Query($nctId: String!) {
    study(nctId: $nctId) {
      nctId
      ...${name}
    }
  }
  ${frag}
`;
}
