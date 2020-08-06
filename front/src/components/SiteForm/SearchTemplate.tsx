import React, { useState }from 'react';
import { FormControl } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { BeatLoader } from 'react-spinners';
import MailMerge from '../MailMerge/MailMerge';
import { GraphqlSchemaType } from '../MailMerge/SchemaSelector';

interface Props {
  template: string;
  onTemplateChanged: (template: string) => void;
  fields: string[];
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
`;

const default_nctid = 'NCT00222898';

const getQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on SearchPageSearchQuery { q, page, pageSize, sorts, aggFilters, crowdAggFilters }`;
  console.log(frag)
  return gql`
  query SearchPageSearchQuery(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
    crowdAggs: aggBuckets(
      params: {
        q: $q
        page: 0
        pageSize: 100000
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        agg: "front_matter_keys"
      }
    ) {
      aggs {
        buckets {
          key
          keyAsString
          docCount
        }
      }
    }
    search(
      params: {
        q: $q
        page: $page
        pageSize: $pageSize
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
      }
    ) {
      recordsTotal
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
      studies {
        ...${name}

      }
    }
  }
  ${frag}

`;
};

function SearchTemplate(props: Props) {
  const [nctId, setNctId] = useState(default_nctid);
  const [fragment, setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const fragmentName = 'search_form_fragment';
  const { data: study } = useQuery(getQuery(fragmentName, fragment), {
    variables: { 
      q: { key: 'AND', children: [] },
      aggFilters: [],
      crowdAggFilters: [],
      sorts: [],
      page: 0,
      pageSize: 100,
     },
  });

  if (!introspection) {
    return <BeatLoader />;
  }
  console.log(introspection)
  const schema : GraphqlSchemaType = {
    kind: 'graphql',
    typeName: 'ElasticStudy',
    types: introspection.__schema.types,
  };
  console.log(fragment)
  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMerge
        schema={schema}
        sample={study?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
        fragmentName={fragmentName}
        fragmentClass="ElasticStudy"
        onFragmentChanged={setFragment}
      />
    </Container>
  );
}

export default SearchTemplate;
