import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import { FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';

interface BucketsDropDownOptionsProps {
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  updater: AggFilterInputUpdater;
  field: any;
}

interface BucketsDropDownOptionsState {
  start?: any;
  end?: any;
  startText?: any;
  endText?: any;
  activeOption: string;
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
  border-radius: 2px;
  border-color: 'red';
`;

class BucketsDropDownOptions extends React.Component<
  BucketsDropDownOptionsProps,
  BucketsDropDownOptionsState
> {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      startText: this.props.updater.input?.gte,
      endText: this.props.updater.input?.lte,
      activeOption: 'Select Option',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        activeOption: 'Select Option',
        startText: this.props.updater.input?.gte,
        endText: this.props.updater.input?.lte,
      });
    }
  }

  onChange = () =>
    this.props.updater.changeRange([
      this.state.start || this.props.updater.input?.gte,
      this.state.end || this.props.updater.input?.lte,
    ]);

  render() {
    const {
      display,
      buckets,
      visibleOptions = [],
      updater,
      field,
    } = this.props;

    const { activeOption } = this.state;

    let activeOptions: string[] = [];

    const changeDropDownRange = e => {
      //e.preventDefault();
      if (display === 'LESS_THAN_DROP_DOWN') {
        this.setState(
          { ...this.state, endText: e.target.value, end: e.target.value },
          this.onChange
        );
      } else {
        this.setState(
          { ...this.state, startText: e.target.value, start: e.target.value },
          this.onChange
        );
      }
    };

    const changeDropDownOption = async e => {
      e.preventDefault();
      activeOptions.forEach(o => {
        updater.removeFilter(o);
      });
      updater.toggleFilter(e.target.value);
    };

    const checkOption = bucket => {
      if (updater.isSelected(bucket.key)) {
        activeOptions.push(bucket.key);
        if (this.state.activeOption !== activeOptions[0]) {
          this.setState({
            activeOption: activeOptions[0],
          });
        }
      }
      //console.log("active", this.state.activeOption)
      return (
        <option value={bucket.key}>
          {defaultTo(bucket.key)(bucket.keyAsString)}{' '}
          {display === 'DROP_DOWN' ? bucket.docCount : null}
        </option>
      );
    };

    if (field?.display === FieldDisplay.DROP_DOWN) {
      return (
        <div className="dropDownFacet">
          <StyledFormControl
            //multiple
            componentClass={'select'}
            value={-1}
            //defaultValue={"Option"}
            //placeholder={"Options"}
            onChange={e => changeDropDownOption(e)}>
            <option disabled value={-1} key={-1}>
              {activeOption}
            </option>
            {buckets
              .filter(
                bucket =>
                  !bucketKeyIsMissing(bucket) &&
                  (visibleOptions.length
                    ? visibleOptions.includes(bucket.key)
                    : true)
              )
              .map(bucket => checkOption(bucket))}
          </StyledFormControl>
        </div>
      );
    } else if (
      field?.display === FieldDisplay.LESS_THAN_DROP_DOWN ||
      field?.display === FieldDisplay.GREATER_THAN_DROP_DOWN
    ) {
      const { startText, endText } = this.state;
      //console.log("END and Start TEXTs", endText, startText)
      const rangeValue =
        display === 'LESS_THAN_DROP_DOWN' ? endText : startText;
      const rangeActiveValue = rangeValue ? rangeValue : 'Select Value';
      const dropDownLabel =
        display === 'LESS_THAN_DROP_DOWN' ? 'Less Than' : 'Greater Than';
      return (
        <div className="dropDownFacet">
          <ControlLabel>{dropDownLabel}</ControlLabel>
          <StyledFormControl
            componentClass={'select'}
            value={-1}
            //defaultValue={"Option"}
            onChange={e => changeDropDownRange(e)}>
            <option disabled value={-1} key={-1}>
              {rangeActiveValue}
            </option>
            {buckets
              .filter(
                bucket =>
                  !bucketKeyIsMissing(bucket) &&
                  (visibleOptions.length
                    ? visibleOptions.includes(bucket.key)
                    : true)
              )
              .map(bucket => checkOption(bucket))}
          </StyledFormControl>
        </div>
      );
    }
  }
}

export default withAggContext(BucketsDropDownOptions);
