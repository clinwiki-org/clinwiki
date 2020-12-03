import React, { useState }from 'react';
import { gql, useQuery }  from '@apollo/client';
import styled from 'styled-components';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';


interface Props {
    children: any;
    fragment:any;
    params:any;
  }
  
  const getQuery = (name: string, frag: string) => {
    frag = frag || `fragment ${name} on SearchPageSearchQuery { q, page, pageSize, sorts, aggFilters, crowdAggFilters }`;
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


export default function StudyFragmentQueryComponent (props:Props) {

    let children = props.children
    const { data: study } = useQuery(getQuery('search_form_fragment', props.fragment), {
        variables:{...props.params, pageSize:50},
      });

        return(
            <>
            {children}
            </>
        )


}
    
    
