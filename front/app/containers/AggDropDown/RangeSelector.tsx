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
import { FieldDisplay } from 'types/globalTypes';
import ThemedButton from 'components/StyledComponents';

interface RangeSelectorProps {
  isOpen: boolean;
  hasMore: boolean;
  loading: boolean;
  buckets: Array<AggBucket>;
  handleLoadMore: () => void;
  updater: AggFilterInputUpdater;
  aggType: FieldDisplay;
  field:any;
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
      startText: this.props.updater.input.gte,
      endText: this.props.updater.input.lte,
    };
  }
  componentDidMount=()=>{
    // let showAlternate= true
    // if(showAlternate){
    //   this.setState({startText: 'Greater Than or Equal to:'})
    // }
  }
  
  onChange = () =>
    this.props.updater.changeRange([
      this.state.start || this.props.updater.input.gte,
      this.state.end || this.props.updater.input.lte,
    ]);

  render() {
    const {
      isOpen,
      hasMore,
      loading,
      buckets,
      handleLoadMore,
      updater,
      aggType,
      field
    } = this.props;
    const { startText, endText } = this.state;
    //Removing Temporarily to see if it fixes date range query issue seems
    //Seems like we don't need a hasMore or beat loader in the Range Selector

    // if (hasMore || loading) {
    //   handleLoadMore();
    //   return (
    //     <div style={{ display: 'flex', justifyContent: 'center' }}>
    //       <BeatLoader key="loader" color="#fff" />
    //     </div>
    //   );
    // }

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
    //     (this.props?.updater?.input?.lte &&
    //       identifier >= this.props?.updater?.input?.lte)
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
    //     (this.props?.updater?.input?.gte &&
    //       identifier <= this.props?.updater?.input?.gte)
    //   ) {
    //     return;
    //   }
    //   end.push(identifier);
    // });

    // we need a smarter sort function than default.
    // start.sort();
    // end.sort();

    const startLabel = field && field.rangeStartLabel || 'Start'
    const endLabel = field && field.rangeEndLabel || 'End'
    if(aggType==FieldDisplay.GREATER_THAN_RANGE){
      return(
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
            <ControlLabel>{startLabel}</ControlLabel>
            <FormControl
              type={'text'}
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
                  {/* this is a placebo, it's really done on onblur */}
        <ThemedButton type="submit">Enter</ThemedButton>

          </Form>
          </Col>
      )
    }else if(aggType==FieldDisplay.LESS_THAN_RANGE){
      return(
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
        <ControlLabel>{endLabel}</ControlLabel>
        <FormControl
          type={'text'}
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
        <ThemedButton type="submit">Enter</ThemedButton>
      </FormGroup>
    </Form>
  </Col>
      );
    }else{

    return (
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
            <ControlLabel>{startLabel}</ControlLabel>
            <FormControl
              type={aggType == FieldDisplay.DATE_RANGE ? 'date' : 'text'}
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
            <ControlLabel>{endLabel}</ControlLabel>
            <FormControl
              type={aggType == FieldDisplay.DATE_RANGE ? 'date' : 'text'}
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
            <ThemedButton type="submit">Enter</ThemedButton>
          </FormGroup>
        </Form>
      </Col>
    );
  }
  }
}

export default withAggContext(RangeSelector);
