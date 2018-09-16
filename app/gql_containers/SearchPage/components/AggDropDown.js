
import React from 'react';
import _ from 'lodash';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DropdownButton, MenuItem, Label } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

const DropdownButtonWrapper = styled.div`
  .selected-aggs {
    margin: 0;
    padding-left: 10px;

    li {
      list-style-type: none;
    }
  }

  .dropdown {
    margin-top: 5px;
    width: 100%;
    button {
      width: 100%;
    }
    ul {
      min-width: 100%;
    }
  }
`;

const QUERY_AGG_BUCKETS = gql`
  query ($agg : String!) {
    aggBuckets(params: {agg: $agg}) {
      aggs {
        name
        docCountErrorUpperBound
        sumDocOtherCount
        buckets {
          key
          docCount
        }
      }
    }
  }`


class AggDropDown extends React.PureComponent {
  // If aggs is null show the props' aggs otherwise show aggs
  state = { buckets: null, loading: false, isOpen: false };
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
                const {data} = await client.query({
                    query: QUERY_AGG_BUCKETS,
                    variables: { agg : this.props.agg }
                });
                const buckets = _.get(data, "aggBuckets.aggs[0].buckets")
                this.setState({ buckets, loading: false, isOpen: true })
            }}
            />
      )}
      </ApolloConsumer>
  }
}

class AggDropDownView extends React.PureComponent {
  render() {
    let {
        key,
        agg, // name
        buckets,
        selectedKeys, // Set
        addFilter,
        removeFilter,
        loading,
        isOpen,
        onLoadMore,
    } = this.props;

    let menuItems = [];
    if (buckets && isOpen) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() => addFilter(agg, buckets[key].key)}>
          {aggKeyToInner(agg, buckets[key].key)}
          {' '}
          ({buckets[key].docCount})
        </MenuItem>
      ));
    }
    if ((!buckets) || loading) {
      menuItems.push(
        <BeatLoader
          key="loader"
          color="#333"
          className="text-center"
        />
      );
    }
    if (menuItems.length === 0) {
      menuItems = (
        <MenuItem disabled>
          <span>
            No results found for
            {' '}
            <i>{aggToField(agg)}</i>
          </span>
        </MenuItem>
      );
    }

    const selectedAggs = []
    selectedKeys.forEach(k => {
        selectedAggs.push(
            <li key={k}>
                <Label>
                {k}
                {' '}
                <FontAwesome
                    className="remove"
                    name="remove"
                    style={{ cursor: 'pointer', color: '#cc1111' }}
                    onClick={() => removeFilter(agg, k)}
                />
                </Label>
            </li>
        )}
    );

    return (
      <DropdownButtonWrapper>
        <DropdownButton
          bsStyle="default"
          bsSize="small"
          title={<b>{aggToField(agg)}</b>}
          id={`agg-${agg.replace(/ /, '-')}`}
          onToggle={onLoadMore}
        >
          {menuItems}
        </DropdownButton>
        <ul className="selected-aggs">
          {selectedAggs}
        </ul>
      </DropdownButtonWrapper>
    );
  }
}

export default AggDropDown;