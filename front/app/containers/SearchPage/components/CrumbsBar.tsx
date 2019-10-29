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
      cardsColor = '#55B88D';
      tableColor = '#90a79d';
    } else {
      cardsColor = '#90a79d';
      tableColor =  '#55B88D';
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
    )

  }

  render() {
    return (
      <CrumbsBarStyleWrappper>
        <Grid className="crumbs-bar">
          <Row>
            <Col xs={12} md={8}>
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
            <Col md={2}>
              <div className="right-align">
                <ControlLabel>View Style: </ControlLabel>{' '}
                <ButtonGroup>
                  <Button
                      onClick={() => this.toggledShowCards('cards', true)}
                      style={{ backgroundColor: this.state.cardsBtnColor }}>
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="th"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-th fa-w-16 fa-lg"
                        style={{ width:'17px' }}>
                      <path
                          fill="currentColor"
                          // tslint:disable-next-line: max-line-length
                          d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM197.3 72h117.3v96H197.3zm0 136h117.3v96H197.3zm-40 232H52c-6.6 0-12-5.4-12-12v-84h117.3zm0-136H40v-96h117.3zm0-136H40V84c0-6.6 5.4-12 12-12h105.3zm157.4 272H197.3v-96h117.3v96zm157.3 0H354.7v-96H472zm0-136H354.7v-96H472zm0-136H354.7V72H472z"
                          className="">
                      </path>
                    </svg>
                  </Button>
                  <Button
                      onClick={() => this.toggledShowCards('table', false)}
                      style={{ backgroundColor: this.state.tableBtnColor }}>
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="th-list"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-th-list fa-w-16 fa-lg"
                        style={{ width:'17px' }}>
                      <path
                          fill="currentColor"
                          // tslint:disable-next-line: max-line-length
                          d="M0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80zm472 224H197.333v-96H472v96zm0 40v84c0 6.627-5.373 12-12 12H197.333v-96H472zM40 208h117.333v96H40v-96zm157.333-40V72H460c6.627 0 12 5.373 12 12v84H197.333zm-40-96v96H40V84c0-6.627 5.373-12 12-12h105.333zM40 344h117.333v96H52c-6.627 0-12-5.373-12-12v-84z"
                          className="">
                      </path>
                    </svg>
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
            <Col xsHidden md={2}>
              {this.loadPaginator()}
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
