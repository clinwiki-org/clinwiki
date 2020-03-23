import * as React from 'react';
import moment from 'moment';
import {
  head,
  last,
  propOr,
  defaultTo,
  equals,
  isEmpty,
  compose,
  sortBy,
} from 'ramda';
import { orderBy, debounce } from 'lodash';
import styled from 'styled-components';
import { Panel, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import UpdateWorkflowsViewMutation from 'mutations/UpdateWorflowsViewMutation';

interface RangeSelectorProps {
  isOpen: boolean;
  hasMore: boolean;
  loading: boolean;
  buckets: Array<AggBucket>;
  handleLoadMore: () => void;
  updater: AggFilterInputUpdater;
}

interface RangeSelectorState {
  start?: any;
  end?: any;
}

const Container = styled.div`
  padding: 10px;
  padding-right: 0;
`;

class RangeSelector extends React.Component<
  RangeSelectorProps,
  RangeSelectorState
> {
  state = {
    start: null,
    end: null,
  };

  onChange = () =>
    this.props.updater.changeRange([
      this.state.start || this.props.updater.aggFilterInput.gte,
      this.state.end || this.props.updater.aggFilterInput.lte,
    ]);

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

    if (isEmpty(buckets)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>None</div>
      );
    }

    // start date is the will be all values from first to end date or last

    const start: any[] = [];
    buckets.forEach(({ key, keyAsString = null }) => {
      const identifier = keyAsString || key;
      if (
        identifier === null ||
        (this.props?.updater?.aggFilterInput?.lte &&
          identifier >= this.props?.updater?.aggFilterInput?.lte)
      ) {
        return;
      }
      start.push(identifier);
    });

    // end date will be all values after start date
    const end: any[] = [];
    buckets.forEach(({ key, keyAsString = null }) => {
      const identifier = keyAsString || key;
      if (
        identifier === null ||
        (this.props?.updater?.aggFilterInput?.gte &&
          identifier <= this.props?.updater?.aggFilterInput?.gte)
      ) {
        return;
      }
      end.push(identifier);
    });

    // we need a smarter sort function than default.
    start.sort();
    end.sort();

    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body id="range-dropdown">
          <Container>
            <Row>
              <Col className="range-selector">
                <DropdownButton
                  title={updater.getMinString() || 'Start'}
                  className="range-selector-button">
                  {start.map(value => (
                    <MenuItem
                      key={`start${value}`}
                      onSelect={() =>
                        this.setState(
                          { ...this.state, start: value },
                          this.onChange
                        )
                      }>
                      {value}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </Col>
            </Row>
            <Row>
              <Col className="range-selector">
                <DropdownButton
                  title={updater.getMaxString() || 'End'}
                  className="range-selector-button">
                  {end.map(value => (
                    <MenuItem
                      key={`end${value}`}
                      onSelect={() =>
                        this.setState(
                          { ...this.state, end: value },
                          this.onChange
                        )
                      }>
                      {value}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </Col>
            </Row>
          </Container>
        </Panel.Body>
      </Panel.Collapse>
    );
  }
}

export default withAggContext(RangeSelector);
