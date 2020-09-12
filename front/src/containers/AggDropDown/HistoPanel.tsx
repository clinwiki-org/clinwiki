import * as React from 'react';
import moment from 'moment';
import { isEmpty } from 'ramda';
import { orderBy, debounce } from 'lodash';
import HistoSlider from 'histoslider';
import styled from 'styled-components';
import { Panel, Row, Col } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';

interface HistoPanelProps {
  isOpen: boolean;
  hasMore: boolean;
  loading: boolean;
  buckets: Array<AggBucket>;
  handleLoadMore: () => void;
  updater: AggFilterInputUpdater;
}

interface HistoPanelState {
  selection?: Array<any>;
  sliderToDate?: any;
  dateToSlider?: any;
  sliderData?: Array<any>;
  start?: string;
  end?: string;
  startParsed?: string;
  endParsed?: string;
}

const Container = styled.div`
  padding: 10px;
  padding-right: 0;
`;

class HistoPanel extends React.Component<HistoPanelProps, HistoPanelState> {
  /**
   * perform the actual request to update the search.
   * note the usage of debounce to decouple slider change
   * from search params change.
   */
  onChange = debounce(val => {
    this.props.updater.changeRange([
      this.state.sliderToDate[Math.floor(val[0])] || this.state.start,
      this.state.sliderToDate[Math.floor(val[1])] || this.state.end,
    ]);
  }, 500);

  bucketsToState = () => {
    /**
     * Populate the data for the slider.
     * We're transforming the discrete date values,
     * which we could just treat as unix time seconds,
     * into much smaller integers because histoslider
     * has trouble using these bigger values when calculating
     * the size of the rectangles for drawing actual histogram.
     */
    const { buckets } = this.props;
    const sliderData = [] as any[];
    const sliderToDate = [] as any[];
    const dateToSlider = {};
    let i = 0;
    let start, end;

    orderBy(buckets, 'keyAsString').forEach(
      ({ key, keyAsString, docCount }, i) => {
        if (docCount > 0 && keyAsString !== undefined) {
          if (start === undefined || start > keyAsString) {
            start = keyAsString;
          }
          if (end === undefined || end < keyAsString) {
            end = keyAsString;
          }
          sliderData.push({
            x0: i,
            x: i + 1,
            y: docCount,
          });
          sliderToDate.push(keyAsString);
          dateToSlider[keyAsString as string] = i;
          end = keyAsString;
          i++;
        }
      }
    );
    return {
      sliderData,
      sliderToDate,
      dateToSlider,
      start,
      end,
    };
  };

  constructor(props) {
    // i still need to figure this all out
    // i want to get the slider state to work independent of the requests.
    super(props);
    this.state = {
      ...this.bucketsToState(),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.buckets !== this.props.buckets) {
      const bts = this.bucketsToState();
      return this.setState({
        ...bts,
        selection: [0, this.props.buckets.length],
      });
    }

    let {
      sliderData = [],
      selection = [-1, -1],
      dateToSlider = {},
      sliderToDate = {},
      start = '',
      end = '',
    } = this.state;

    if (prevState.selection !== selection) {
      this.onChange(selection);
    }
  }

  render() {
    const {
      isOpen,
      hasMore,
      loading,
      buckets,
      handleLoadMore,
      updater,
    } = this.props;
    if (!this.state || !buckets) {
      return null;
    }
    const { selection } = this.state;
    const { sliderToDate, dateToSlider, sliderData, start, end } = this.state;
    if (hasMore || loading) {
      handleLoadMore();
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BeatLoader key="loader" color="#fff" />
        </div>
      );
    }

    if (isEmpty(sliderData)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>None</div>
      );
    }

    let startParsed = '?';
    let endParsed = '?';

    if (selection && selection.length == 2) {
      const [start, end] = selection;
      if (sliderToDate[start]) {
        startParsed = moment(sliderToDate[start])
          .utc(false)
          .format('YYYY-MM-DD');
      }
      if (sliderToDate[end]) {
        endParsed = moment(sliderToDate[end])
          .utc(false)
          .format('YYYY-MM-DD');
      }
    }

    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body>
          <Container>
            <Row>
              <Col>
                <HistoSlider
                  data={sliderData}
                  onChange={x => {
                    this.setState({ selection: x.map(Math.ceil) });
                  }}
                  showLabels={false}
                  padding={10}
                  height={100}
                  width={180}
                  selection={selection}
                  histogramStyle={{
                    backgroundColor: '#394149',
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>{`Start: ${startParsed}`}</Col>
              <Col>{`End: ${endParsed}`}</Col>
            </Row>
          </Container>
        </Panel.Body>
      </Panel.Collapse>
    );
  }
}

export default withAggContext(HistoPanel);
