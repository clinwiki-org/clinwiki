import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import { FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';
import { find, propEq } from 'ramda';

interface DistanceDropDownOptionsProps {
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  updater: AggFilterInputUpdater;
  field: any;
  useDefaultRadius: ()=> void;
  zipcode: any;
}

interface DistanceDropDownOptionsState {
  start?: any;
  end?: any;
  startText?: any;
  endText?: any;
  zipcode: any;
  radius: any;
  lat: number | null;
  long: number | null;
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
  border-radius: 2px;
  border-color: 'red';
`;

class DistanceDropDownOptions extends React.Component<
  DistanceDropDownOptionsProps,
  DistanceDropDownOptionsState
  > {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      startText: this.props.updater.input?.gte,
      endText: this.props.updater.input?.lte,
      zipcode: this.props.updater.input?.zipcode,
      radius: this.props.zipcode,
      lat: null,
      long: null,
    };
  }



  render() {
    const {
      display,
      buckets,
      visibleOptions = [],
      updater,
      field,
    } = this.props;

    const { radius } = this.state;

    let activeOptions: string[] = [];

    const changeDropDownOption = async e => {
      e.preventDefault();
      this.setState({ radius: e.target.value },
        () => updater.changeRadius([
          this.state.radius || this.props.updater.input?.radius,
        ])
      )

      activeOptions.forEach(o => {
        updater.removeFilter(o);
      });


    };

    const checkOption = (bucket, field) => {
      if (updater.isSelected(bucket)) {
        activeOptions.push(bucket);
        if (this.state.radius !== activeOptions[0]) {
          this.setState({
            radius: activeOptions[0],
          });
        }

      }
      return (
        <option key={bucket} value={bucket}>
          {`${bucket} miles`}
        </option>
      );
    };
    return (
      <div className="dropDownFacet">
        <StyledFormControl
          componentClass={'select'}
          value={-1}
          onChange={e => changeDropDownOption(e)}>
          <option disabled value={-1} key={-1}>
            {`${radius} miles`}
          </option>
          {buckets.map(bucket => checkOption(bucket, field))}
        </StyledFormControl>
      </div>
    );
  }
}

export default withAggContext(DistanceDropDownOptions);
