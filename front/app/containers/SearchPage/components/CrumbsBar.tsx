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
  ButtonGroup,
  ControlLabel,
} from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import aggToField from 'utils/aggs/aggToField';
import MultiCrumb from 'components/MultiCrumb';
import { MAX_WINDOW_SIZE } from '../../../utils/constants';
import { PulseLoader } from 'react-spinners';

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
      border-radius: 2px !important;
    }

    input.form-control {
      border: 0px;
      box-shadow: none;
      margin-right: 10px;
      margin-left: 10px;
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
  showCards: Boolean;
  toggledShowCards: Function;
}
interface CrumbsBarState {
  searchTerm: string;
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

  constructor(props) {

    super(props);

    let cardsColor = '';
    let tableColor = '';

    if (window.localStorage.getItem('showCards') === 'true') {
      cardsColor = '#90a79d';
      tableColor = '#55B88D';
    } else {
      cardsColor = '#55B88D';
      tableColor =  '#90a79d';
    }

    this.state = { searchTerm: '', cardsBtnColor: cardsColor, tableBtnColor: tableColor };

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
    e.preventDefault();
    this.props.addSearchTerm(this.state.searchTerm);
    this.setState({ searchTerm: '' });
  };

  toggledShowCards = (type, showCards) => {
    if (type === 'cards') {
      this.setState({ cardsBtnColor: '#90a79d', tableBtnColor: '#55B88D' });
    } else if (type === 'table') {
      this.setState({ cardsBtnColor: '#55B88D', tableBtnColor: '#90a79d' });
    }
    this.props.toggledShowCards(showCards);
  }

  render() {
    return (
      <CrumbsBarStyleWrappper>
        <Grid className="crumbs-bar">
          <Row>
            <Col xs={12} md={5}>
              <Form inline className="searchInput" onSubmit={this.onSubmit}>
                <FormGroup>
                  <ControlLabel>Search Within: </ControlLabel>{' '}
                  <FormControl
                    type="text"
                    placeholder="search..."
                    onChange={this.localSearchChange}
                  />
                </FormGroup>
                <Button type="submit">
                  <FontAwesome name="search" />
                </Button>
              </Form>
            </Col>
            <Col>
              <ControlLabel>View Style: </ControlLabel>{' '}
              <ButtonGroup>
                <Button
                    onClick={() => this.toggledShowCards('cards', true)}
                    style={{ backgroundColor: this.state.cardsBtnColor }}>
                  < FontAwesome name="th" />
                </Button>
                <Button
                    onClick={() => this.toggledShowCards('table', false)}
                    style={{ backgroundColor: this.state.tableBtnColor }}>
                  < FontAwesome name="table" /></Button>
              </ButtonGroup>
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
