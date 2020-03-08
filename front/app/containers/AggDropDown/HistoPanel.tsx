import * as React from 'react';
import moment from 'moment';
import { head, last, propOr, defaultTo, map } from 'ramda';
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
  selected: Array<any>;
}

const Container = styled.div`
  padding: 10px;
  padding-right: 0;
`;

class HistoPanel extends React.Component<HistoPanelProps, HistoPanelState> {
  componentDidUpdate() {}

  render() {
    const {
      isOpen,
      hasMore,
      loading,
      buckets,
      handleLoadMore,
      updater,
    } = this.props;
    if (hasMore || loading) {
      handleLoadMore();
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BeatLoader key="loader" color="#fff" />
        </div>
      );
    }

    /**
     * Populate the data for the slider.
     * We're transforming the discrete date values,
     * which we could just treat as unix time seconds,
     * into much smaller integers because histoslider
     * has trouble using these bigger values when calculating
     * the size of the rectangles for drawing actual histogram.
     */
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

    console.log('slider data is', sliderData);
    console.log('slider to date is', sliderToDate);

    const onChange = debounce(val => {
      console.log('onchagne val is', val);
      console.log(
        'setting to',
        sliderToDate[Math.floor(val[0])] || start,
        sliderToDate[Math.floor(val[1])] || end
      );
      updater.changeRange([
        sliderToDate[Math.floor(val[0])] || start,
        sliderToDate[Math.floor(val[1])] || end,
      ]);
    }, 250);

    let selection = updater.getRangeSelection();
    if (selection) {
      selection = map(x => dateToSlider[x], selection);
    }

    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body>
          <Container>
            <Row>
              <Col>
                <HistoSlider
                  data={sliderData}
                  onChange={onChange}
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
              <Col>Start: {moment(start).format('YYYY-MM-DD')}</Col>
              <Col>End: {moment(end).format('YYYY-MM-DD')}</Col>
            </Row>
          </Container>
        </Panel.Body>
      </Panel.Collapse>
    );
  }
}

export default withAggContext(HistoPanel);
