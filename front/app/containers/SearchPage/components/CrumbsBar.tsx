import * as React from "react";
import {
  Grid,
  Row,
  Col,
  Label,
  Button,
  FormControl,
  Form,
  FormGroup
  ButtonGroup,
  ControlLabel,
} from "react-bootstrap";
import * as FontAwesome from "react-fontawesome";
import gql from "graphql-tag";
import { ApolloConsumer } from "react-apollo";
import * as Autosuggest from "react-autosuggest";
import styled from "styled-components";
import aggToField from "utils/aggs/aggToField";
import MultiCrumb from "components/MultiCrumb";
import SiteProvider from "containers/SiteProvider";
import { MAX_WINDOW_SIZE, aggsOrdered } from "../../../utils/constants";
import { PulseLoader } from "react-spinners";
import CurrentUser from 'containers/CurrentUser';

const AUTOSUGGEST_QUERY = gql`
  query SearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
    $fields: [String!]!
  ) {
    autocomplete(
      fields: $fields
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        aggOptionsSort: [{ id: "count", desc: true }]
        page: $page
        pageSize: $pageSize
      }
    ) {
      autocomplete {
        name
        results {
          key
          docCount
        }
        __typename
      }
      __typename
    }
  }
`;

const CrumbsBarStyleWrappper = styled.div`
  .crumbs-bar {
    padding: 10px 30px;
    border: solid white 1px;
    background-color: #f2f2f2;
    color: black;
    margin-bottom: 1em;
    width: 100%;

    .container {
      background: #d9deea;
      border: 0px;
      margin-top: 5px;
      color: #394149;
    }

    i {
      font-style: normal;
      margin-right: 3px;
      text-transform: capitalize;
    }

    span.label.label-default {
      padding: 7px !important;
      border-radius: 4px !important;
    }

    input.form-control {
      border: 0px;
      box-shadow: none;
      margin-right: 10px;
      margin-left: 10px;
    }

    span.label {
      background: #55B88D;
      padding: 5px;
      font-size: 12px;
      border-radius: 4px;
      margin-right: 5px;
      text-transform: capitalize;

      span.fa-remove {
        color: #fff !important;
        opacity: 0.5;
        margin-left: 5px !important;
      }

      span.fa-remove:hover {
        opacity: 1;
      }

      b {
        padding-right: 5px;
      }

      b:last-of-type {
        padding-right: 0px;
      }
    }
  }
  .right-align {
    text-align: right;
  }

  div.row > div {
    padding-left: 0px;
  }

  .searchInput {
    padding-bottom: 10px;
  }
`;

import { AggCallback, SearchParams } from "../Types";
import { isEmpty } from "ramda";

//
interface CrumbsBarProps {
  searchParams: SearchParams;
  onBulkUpdate: () => void;
  removeFilter: AggCallback;
  addSearchTerm: (term: string) => void;
  removeSearchTerm: (term: string, bool?) => void;
  page: number;
  recordsTotal: number;
  pagesTotal: number;
  pageSize: number;
  update: { page: (n: number) => void };
  onReset: () => void;
  loading: boolean;
  data: any;
  siteView: any;
  showCards: Boolean;
  toggledShowCards: Function;
}
interface CrumbsBarState {
  searchTerm: string;
  suggestions: any;
  cardsBtnColor: string;
  tableBtnColor: string;
}

const Crumb = ({ category, value, onClick }) => {
  return (
    <Label>
      <i>{category}:</i> <b>{value}</b>
      <FontAwesome
        className="remove"
        name="remove"
        style={{ cursor: "pointer", color: "#cc1111", margin: "0 0 0 3px" }}
        onClick={onClick}
      />
    </Label>
  );
};

export default class CrumbsBar extends React.Component<
  CrumbsBarProps,
  CrumbsBarState
> {

  constructor(props) {

    super(props);

    let cardsColor = '';
    let tableColor = '';

    if (window.localStorage.getItem('showCards') === 'true') {
      cardsColor = '#55B88D';
      tableColor = '#90a79d';
    } else {
      cardsColor = '#90a79d';
      tableColor =  '#55B88D';
    }

    this.state = { 
      searchTerm: '', 
      suggestions: [],
      cardsBtnColor: cardsColor, 
      tableBtnColor: tableColor };

  }

  *mkCrumbs(searchParams: SearchParams, removeFilter) {
    if (!isEmpty(searchParams.q)) {
      yield (
        <MultiCrumb
          key="Search"
          category="search"
          values={searchParams.q}
          onClick={term => this.props.removeSearchTerm(term)}
        />
      );
    }
    for (const key in searchParams.aggFilters) {
      const agg = searchParams.aggFilters[key];
      const cat = aggToField(agg.field);
      yield (
        <MultiCrumb
          category={cat}
          values={agg.values}
          onClick={val => removeFilter(agg.field, val)}
          key={cat + agg.values.join()}
        />
      );
    }
    for (const key in searchParams.crowdAggFilters) {
      const agg = searchParams.crowdAggFilters[key];
      const cat = aggToField(agg.field);
      yield (
        <MultiCrumb
          category={cat}
          values={agg.values}
          onClick={val => removeFilter(agg.field, val, true)}
          key={cat + agg.values.join("")}
        />
      );
    }
    const totalLength =
      searchParams.q.length +
      searchParams.crowdAggFilters.length +
      searchParams.aggFilters.length;
    if (totalLength > 0) {
      yield (
        <Button
          bsSize="small"
          key="reset"
          onClick={this.props.onReset}
          style={{ marginLeft: "10px" }}
        >
          Reset
        </Button>
      );
    }
  }

  getFieldsFromSubsiteConfig = (aggs, crowdAggs) => {
    let aggFields: string[] = [];
    if (aggs.length > 0) {
      aggs.map(i => {
        if (i.autoSuggest) {
          aggFields.push(i.name);
        }
      });
    }
    if (crowdAggs.length > 0) {
      crowdAggs.map(i => {
        if (i.autoSuggest) {
          aggFields.push(i.name);
        }
      });
    }
    return aggFields;
  };

  queryAutoSuggest = async apolloClient => {
    const { searchTerm } = this.state;
    const { searchParams, data } = this.props;

    const newParams = searchParams.q.map(i => {
      return { children: [], key: i };
    });
    const fields = this.getFieldsFromSubsiteConfig(
      data.siteView.search.aggs.fields,
      data.siteView.search.crowdAggs.fields
    );
    const query = AUTOSUGGEST_QUERY;

    const variables = {
      agg: "browse_condition_mesh_terms",
      aggFilters: searchParams.aggFilters,
      aggOptionsFilter: searchTerm,
      crowdAggFilters: [],
      page: 0,
      pageSize: 5,
      q: {
        children: newParams,
        key: "AND"
      },
      sorts: [],
      fields: fields
    };

    const response = await apolloClient.query({
      query,
      variables
    });

    const array = response.data.autocomplete.autocomplete;

    this.setState({
      suggestions: array
    });
  };

  onSuggestionsFetchRequested = () => {};

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.key;
  };

  renderSuggestion = suggestion => {
    return <span>{`${suggestion.key} (${suggestion.docCount})`}</span>;
  };

  getSectionSuggestions = section => {
    return section.results;
  };

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.setState({ searchTerm: suggestionValue }, () => this.onSubmit(event));
  };

  renderSectionTitle = section => {
    if (section.results.length > 0) {
      let newName = aggToField(section.name);
      newName = this.capitalize(newName);
      return <strong>{newName}</strong>;
    } else return null;
  };

  onChange = (e, { newValue }, apolloClient) => {
    this.setState(
      {
        searchTerm: newValue
      },
      () => {
        this.queryAutoSuggest(apolloClient);
      }
    );
  };

  clearPrimarySearch = () => {
    this.props.removeSearchTerm("", true);
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.addSearchTerm(this.state.searchTerm);
    this.setState({ searchTerm: "" });
  };

  toggledShowCards = (type, showCards) => {
    if (type === 'cards') {
      this.setState({ cardsBtnColor: '#55B88D', tableBtnColor: '#90a79d' });
    } else if (type === 'table') {
      this.setState({ cardsBtnColor: '#90a79d', tableBtnColor: '#55B88D' });
    }
    this.props.toggledShowCards(showCards);
  }

  loadPaginator = () => {

    if (this.props.showCards) {
      return (
        <div className="right-align">
          <div>
            {this.props.recordsTotal} results
          </div>
          <div>
            {this.props.recordsTotal > MAX_WINDOW_SIZE ? `(showing first ${MAX_WINDOW_SIZE})` : null}
          </div>
        </div>
      )
    }

    return (
      <div className="right-align">
        {this.props.page > 0 && !this.props.loading ? (
          <FontAwesome
            className="arrow-left"
            name="arrow-left"
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={() => this.props.update.page(this.props.page - 1)}
          />
        ) : <FontAwesome
          className="arrow-left"
          name="arrow-left"
          style={{ margin: '5px', color: 'gray' }}
        />}
        page{' '}
        <b>
          {this.props.loading ? 
            <div id="divsononeline"><PulseLoader color="#cccccc" size={8} /></div> : 
            `${Math.min(this.props.page + 1, this.props.pagesTotal)}/${this.props.pagesTotal}`}{' '}
        </b>
        {this.props.page + 1 < this.props.pagesTotal && !this.props.loading ? (
          <FontAwesome
            className="arrow-right"
            name="arrow-right"
            style={{ cursor: 'pointer', margin: '5px' }}
            onClick={() => this.props.update.page(this.props.page + 1)}
          />
        ) : <FontAwesome
          className="arrow-right"
          name="arrow-right"
          style={{ margin: '5px', color: 'gray' }}
        />}
        <div>
          {this.props.recordsTotal} results
        </div>
        <div>
          {this.props.recordsTotal > MAX_WINDOW_SIZE ? `(showing first ${MAX_WINDOW_SIZE})` : null}
        </div>
      </div>
    )
  }

  render() {
    const { searchTerm, suggestions } = this.state;
    const { data } = this.props;
    return  (
      <CrumbsBarStyleWrappper>
        <ApolloConsumer>
          {apolloClient => (
            <Grid className="crumbs-bar">
              <Row>
                <Col xs={12} md={8}>
                  <Form inline className="searchInput" onSubmit={this.onSubmit}>
                    <FormGroup>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <b style={{ marginRight: "8px", marginTop: "4px" }}>
                          Search Within:
                        </b>
                        <Autosuggest
                          multiSection={true}
                          suggestions={suggestions}
                          inputProps={{
                            value: searchTerm,
                            onChange: (e, searchTerm) =>
                              this.onChange(e, searchTerm, apolloClient)
                          }}
                          renderSuggestion={this.renderSuggestion}
                          renderSectionTitle={this.renderSectionTitle}
                          getSectionSuggestions={this.getSectionSuggestions}
                          onSuggestionSelected={this.onSuggestionSelected}
                          onSuggestionsFetchRequested={
                            this.onSuggestionsFetchRequested
                          }
                          onSuggestionsClearRequested={
                            this.onSuggestionsClearRequested
                          }
                          getSuggestionValue={this.getSuggestionValue}
                        />
                      </div>
                    </FormGroup>
                    <Button type="submit">
                      <FontAwesome name="search" />
                    </Button>
                    &nbsp;
                    <CurrentUser>
                      { user => user && user.roles.includes("admin") ? <Button onClick={this.props.onBulkUpdate}>Bulk Update <FontAwesome name="truck" /></Button> : null }
                    </CurrentUser>
                  </Form>
                </Col>
                <Col xsHidden md={2}>
                  {this.loadPaginator()}
                </Col>
              </Row>
              <Row>
                <Col md={12} style={{ padding: "10px 0px" }}>
                  <b>Filters: </b>
                  {Array.from(
                    this.mkCrumbs(
                      this.props.searchParams,
                      this.props.removeFilter
                    )
                  )}
                </Col>
              </Row>
            </Grid>
          )}
        </ApolloConsumer>
      </CrumbsBarStyleWrappper>
    );
  }
}
