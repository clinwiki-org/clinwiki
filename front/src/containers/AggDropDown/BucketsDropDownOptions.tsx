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
  agg: string;
}

interface BucketsDropDownOptionsState {
  start?: any;
  end?: any;
  startText?: any;
  endText?: any;
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
    };
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
      agg,
    } = this.props;

    let activeOptions: string[] = [];

    const changeDropDownRange = e => {
      //e.preventDefault();
      if (display === 'LESS_THAN_DROP_DOWN') {
        this.setState({ ...this.state, endText:e.target.value, end: e.target.value }, this.onChange);
      } else {
        this.setState({ ...this.state, startText:e.target.value, start: e.target.value }, this.onChange);
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
      }
      //console.log("active", activeOptions)
      return (
        <option value={bucket.key}>
          {defaultTo(bucket.key)(bucket.keyAsString)}{' '}
          {display === 'DROP_DOWN' ? bucket.docCount : null}
        </option>
      );
    };

    // console.log("Active Opt", (activeOptions.length !== 0))
    //console.log('Active Opt', activeOptions);
    const selectedOption =
      activeOptions === undefined || activeOptions.length === 0
        ? 'Select Option'
        : activeOptions;
    // console.log("!!!!!!!!!!", selectedOption)

    //TODO Needs default value text when no option is selected on drop down yet, could use state
    // ! when filter is removed from top with "x". Dropdown default value doesn't reflect change.

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
              {activeOptions}
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
      const rangeValue = display === 'LESS_THAN_DROP_DOWN' ? endText : startText;
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
              {rangeValue}
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
