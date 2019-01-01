
import * as React from 'react';
import * as _ from 'lodash';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DropdownButton, MenuItem, Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { AggBucket, AggCallback, SearchParams } from '../Types'
import { AggDropDownView } from './AggDropDownView'

const QUERY_AGG_BUCKETS = gql`
  query ($agg : String!, $q : String, $sorts:[Sort!], $aggFilters:[AggFilter!], $crowdAggFilters:[AggFilter!]) {
    aggBuckets(params: {agg: $agg, q: $q, sorts: $sorts, aggFilters: $aggFilters, crowdAggFilters: $crowdAggFilters }) {
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
    }
  }`

  const QUERY_CROWD_AGG_BUCKETA = gql`
  query ($agg : String!, $q: String, $sorts:[Sort!], $aggFilters:[AggFilter!]) {
    aggBuckets: crowdAggBuckets(params: {agg:$agg, q: $q, sorts: $sorts, aggFilters: $aggFilters }) {
      aggs {
        buckets {
          key
          docCount
        }
      }
    }
  }
  `

interface AggDropDownState {
  buckets: AggBucket[]
  loading: boolean
  isOpen: boolean
}
interface AggDropDownProps {
  agg: string
  buckets?: AggBucket[]
  searchParams: SearchParams
  isCrowdAgg: boolean
  selectedKeys : Set<string>
  addFilter: AggCallback
  removeFilter: AggCallback
}

export class AggDropDown extends React.Component<AggDropDownProps,AggDropDownState> {
  // If aggs is null show the props' aggs otherwise show aggs
  state = { buckets: [], loading: false, isOpen: false };
  refreshAggs = (buckets) => {
    this.setState({ buckets, loading:false });
  }
  render() {
    return <ApolloConsumer>
      {client => (
        <AggDropDownView 
            {...this.props} 
            buckets={this.state.buckets||this.props.buckets} 
            loading={this.state.loading}
            isOpen={this.state.isOpen}
            onLoadMore={async (isOpen) => {
                if (!isOpen) {
                    this.setState({loading:false, isOpen: false})
                    return
                }
                this.setState({ ... this.state, loading: true, isOpen: true })

                const {data} = 
                  this.props.isCrowdAgg ?
                    await client.query({
                        query: QUERY_CROWD_AGG_BUCKETA,
                        variables: {
                          ... this.props.searchParams, 
                          crowdAggFilters: this.props.searchParams.crowdAggFilters.filter(agg => agg.field != this.props.agg),
                          agg : this.props.agg }
                    }) :
                    await client.query({
                        query: QUERY_AGG_BUCKETS,
                        variables: {
                          ... this.props.searchParams, 
                          aggFilters: this.props.searchParams.aggFilters.filter(agg => agg.field != this.props.agg),
                          agg : this.props.agg }
                    })
                const buckets = _.get(data, "aggBuckets.aggs[0].buckets")
                this.setState({ buckets, loading: false, isOpen: true })
            }}
            />
      )}
      </ApolloConsumer>
  }
}



export default AggDropDown