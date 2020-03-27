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
import {
  Row,
  Col,
  MenuItem,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
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
  startText?: any;
  endText?: any;
}

class RangeSelector extends React.Component<
  RangeSelectorProps,
  RangeSelectorState
> {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      startText: this.props.updater.aggFilterInput.gte,
      endText: this.props.updater.aggFilterInput.lte,
    };
  }

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
    const { startText, endText } = this.state;
    if (hasMore || loading) {
      handleLoadMore();
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BeatLoader key="loader" color="#fff" />
        </div>
      );
    }

    // if (isEmpty(buckets)) {
    //   return (
    //     <div style={{ display: 'flex', justifyContent: 'center' }}>None</div>
    //   );
    // }

    // const start: any[] = [];
    // buckets.forEach(({ key, keyAsString = null }) => {
    //   const identifier = keyAsString || key;
    //   if (
    //     identifier === null ||
    //     (this.props?.updater?.aggFilterInput?.lte &&
    //       identifier >= this.props?.updater?.aggFilterInput?.lte)
    //   ) {
    //     return;
    //   }
    //   start.push(identifier);
    // });

    // const end: any[] = [];
    // buckets.forEach(({ key, keyAsString = null }) => {
    //   const identifier = keyAsString || key;
    //   if (
    //     identifier === null ||
    //     (this.props?.updater?.aggFilterInput?.gte &&
    //       identifier <= this.props?.updater?.aggFilterInput?.gte)
    //   ) {
    //     return;
    //   }
    //   end.push(identifier);
    // });

    // we need a smarter sort function than default.
    // start.sort();
    // end.sort();

    return (
      <Row>
        <Col className="range-selector">
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.setState(
                { ...this.state, start: startText, end: endText },
                this.onChange
              );
            }}>
            <FormGroup>
              <ControlLabel>Start</ControlLabel>
              <FormControl
                type="text"
                value={startText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    startText: e.target.value,
                  })
                }
                onBlur={e =>
                  this.setState(
                    { ...this.state, start: startText },
                    this.onChange
                  )
                }></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>End</ControlLabel>
              <FormControl
                type="text"
                value={endText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    endText: e.target.value,
                  })
                }
                onBlur={e =>
                  this.setState({ ...this.state, end: endText }, this.onChange)
                }></FormControl>
            </FormGroup>
            <FormGroup>
              {/* this is a placebo, it's really done on onblur */}
              <Button type="submit">Enter</Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default withAggContext(RangeSelector);
