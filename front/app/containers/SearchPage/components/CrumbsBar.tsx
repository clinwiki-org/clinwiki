import * as React from 'react';
import {
  Grid,
  Row,
  Col,
  Label,
  Button,
  FormControl,
  Form,
  FormGroup,
} from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import MultiCrumb from 'components/MultiCrumb';
import AutoSuggester from './AutoSuggester';

const CrumbsBarStyleWrappper = styled.div`
  .crumbs-bar {
    padding: 10px 30px;
    border: solid white 1px;
    background-color: #f2f2f2;
    color: black;
    margin-bottom: 1em;

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
      border-radius: 2px !important;
    }

    input.form-control {
      border: 0px;
      box-shadow:none;
      margin-right: 10px;
      height:100%;
      width:100%;
      clear: both;
    }
    input.rbt-input-hint {
      opacity: 0;
    }


    span.label {
      background: none;
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

import { AggCallback, SearchParams } from '../Types';
import { isEmpty } from 'ramda';
import { MAX_WINDOW_SIZE } from '../../../utils/constants';
import { PulseLoader } from 'react-spinners';

//
interface CrumbsBarProps {
  searchParams: SearchParams;
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
}
interface CrumbsBarState {
  searchTerm: string;
}

const Crumb = ({ category, value, onClick }) => {
  return (
    <Label>
      <i>{category}:</i> <b>{value}</b>
      <FontAwesome
        className="remove"
        name="remove"
        style={{ cursor: 'pointer', color: '#cc1111', margin: '0 0 0 3px' }}
        onClick={onClick}
      />
    </Label>
  );
};

export default class CrumbsBar extends React.Component<
  CrumbsBarProps,
  CrumbsBarState
> {
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
          key={cat + agg.values.join('')}
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
          style={{ marginLeft: '10px' }}
        >
          Reset
        </Button>
      );
    }
  }

  localSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };
  clearPrimarySearch = () => {
    this.props.removeSearchTerm('', true);
  };
  onSubmit = e => {
    //console.log('hi');
    e.preventDefault();
    this.props.addSearchTerm(this.state.searchTerm);
    this.setState({ searchTerm: '' });
  };

  inputSearchChange = val => {
    this.setState({searchTerm:val})
  }

  clickSearchChange = val => {
    this.setState({searchTerm:val[0]})
  }
  render() {
    return (
      <CrumbsBarStyleWrappper>
        <Grid className="crumbs-bar">
          <Row>
            <Col xs={12} md={9}>
              <Form inline className="searchInput" onSubmit={this.onSubmit}>
                <FormGroup>
                  <b>Search Within: </b>

                  <FormControl

                    componentClass={AutoSuggester}
                    onInputChange={this.inputSearchChange}
                    onChange={this.clickSearchChange}
                    id='searcher'
                    placeholder='search...'
                    params = {val=>{return val}}
                    autocomplete='off'/>


                </FormGroup>

                <Button type="submit">
                  <FontAwesome name="search" />
                </Button>
              </Form>


            </Col>
            <Col xsHidden md={3}>
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
                /> }
                page{' '}
                <b>
                  {this.props.loading ? <div id="divsononeline"><PulseLoader color="#cccccc" size={8} /></div>
                    : `${Math.min(this.props.page + 1, this.props.pagesTotal)}/${this.props.pagesTotal}`}{' '}
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
            </Col>
          </Row>
          {/* <Row>
          <Col md={10}>
          </Col>
          <Col md={2}>
            <div className="right-align">
              <DropdownButton title={this.props.pageSize+" Rows"} >
                <MenuItem eventKey="1">5 Rows</MenuItem>
                <MenuItem eventKey="2">10 Rows</MenuItem>
                <MenuItem eventKey="3">20 Rows</MenuItem>
                <MenuItem eventKey="4">25 Rows</MenuItem>
                <MenuItem eventKey="5">50 Rows</MenuItem>
                <MenuItem eventKey="5">100 Rows</MenuItem>
              </DropdownButton>
            </div>
          </Col>
        </Row> */}
          <Row>
            <Col md={12} style={{ padding: '10px 0px' }}>
              <b>Filters: </b>
              {Array.from(
                this.mkCrumbs(this.props.searchParams, this.props.removeFilter),
              )}
            </Col>
          </Row>
        </Grid>
      </CrumbsBarStyleWrappper>
    );
  }
}
