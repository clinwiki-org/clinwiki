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
      radius: this.props.updater.input?.radius,
      lat: null,
      long: null,
    };
  }

  componentDidMount() {
    if (!this.state.radius) {
      this.props.updater.changeRadius(['50'])
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        radius: this.props.updater.input?.radius,
        startText: this.props.updater.input?.gte,
        endText: this.props.updater.input?.lte,
      });
    }
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
    const showLocation = (position) => {
      this.setState({ lat: position.coords.latitude, long: position.coords.longitude },

      )

    }
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
      // const bucketKeyValuePair = field.bucketKeyValuePairs ? find(propEq('key', bucket.key))(field.bucketKeyValuePairs) : false;
      // if (!bucketKeyValuePair) {
      //   return (
      //     <option key={bucket.key + bucket.count} value={bucket.key}>
      //       {defaultTo(bucket.key)(bucket.keyAsString)}{' '}
      //       {display === 'DROP_DOWN' ? bucket.docCount : null}
      //     </option>
      //   );
      // } else {
      //   return (
      //     <option key={bucket.key + bucket.count} value={bucket.key}>
      //       {`${bucketKeyValuePair.key} - ${bucketKeyValuePair.label}`}
      //     </option>
      //   );
      // }
    };
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
            {radius}
          </option>
          {buckets.map(bucket => checkOption(bucket, field))}
        </StyledFormControl>
      </div>
    );
  }
}

export default withAggContext(DistanceDropDownOptions);
