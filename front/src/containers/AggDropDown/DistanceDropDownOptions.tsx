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
  activeOption: string;
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


    const changeDropDownOption = async e => {
      e.preventDefault();
      activeOptions.forEach(o => {
        updater.removeFilter(o);
      });
      updater.toggleFilter(e.target.value);
    };

    const checkOption = (bucket, field) => {
      if (updater.isSelected(bucket.key)) {
        activeOptions.push(bucket.key);
        if (this.state.activeOption !== activeOptions[0]) {
          this.setState({
            activeOption: activeOptions[0],
          });
        }
      }

      const bucketKeyValuePair = field.bucketKeyValuePairs ? find(propEq('key', bucket.key))(field.bucketKeyValuePairs) : false;
      if (!bucketKeyValuePair) {
        return (
          <option key={bucket.key + bucket.count} value={bucket.key}>
            {defaultTo(bucket.key)(bucket.keyAsString)}{' '}
            {display === 'DROP_DOWN' ? bucket.docCount : null}
          </option>
        );
      } else {
        return (
          <option key={bucket.key + bucket.count} value={bucket.key}>
            {`${bucketKeyValuePair.key} - ${bucketKeyValuePair.label}`}
          </option>
        );
      }
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
              .map(bucket => checkOption(bucket, field))}
          </StyledFormControl>
        </div>
      );
  }
}

export default withAggContext(DistanceDropDownOptions);
