
import * as React from 'react';
import * as _ from 'lodash';
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { AggBucket, AggCallback, SearchParams, gqlParams } from '../Types'
import { AggDropDownView } from './NewAggDropDownView'

const QUERY_AGG_BUCKETS = gql`
  query ($agg : String!, $q : String, $aggFilters:[AggFilter!], $crowdAggFilters:[AggFilter!]) {
    aggBuckets(params: {agg: $agg, q: $q, sorts: [], aggFilters: $aggFilters, crowdAggFilters: $crowdAggFilters, page: 0, pageSize: 1000 }) {
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
  query ($agg : String!, $q: String, $aggFilters:[AggFilter!], $crowdAggFilters:[AggFilter!]) {
    aggBuckets: crowdAggBuckets(params: {agg:$agg, q: $q, sorts: [], aggFilters: $aggFilters, crowdAggFilters: $crowdAggFilters, page: 0, pageSize: 1000 }) {
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
  query = ({client, query, variables}) => {
    console.log(`Agg: ${JSON.stringify(variables)}`)
    return client.query({
      query,
      variables
    });
  }
  render() {
    return <ApolloConsumer>
      {client => (
        <AggDropDownView 
            key={this.props.agg}
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
                    await this.query({
                        client,
                        query: QUERY_CROWD_AGG_BUCKETA,
                        variables: {
                          ... gqlParams(this.props.searchParams), 
                          crowdAggFilters: this.props.searchParams.crowdAggFilters.filter(agg => agg.field != this.props.agg),
                          agg : this.props.agg }
                    }) :
                    await this.query({
                        client,
                        query: QUERY_AGG_BUCKETS,
                        variables: {
                          ... gqlParams(this.props.searchParams), 
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