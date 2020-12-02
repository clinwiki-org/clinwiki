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
  lat: number | null;
  long: number| null;
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
      lat: null,
      long: null,
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

  // onChange = () =>
  //   this.props.updater.changeDistance([
  //     this.state.activeOption || this.props.updater.input?.radius,
  //     this.state.lat || this.props.updater.input?.lat,
  //     this.state.long || this.props.updater.input?.long,
  //   ]);

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
    const showLocation = (position) =>{
      console.log("Position",position)
      this.setState({lat: position.coords.latitude, long: position.coords.longitude}, 
        ()=>       updater.changeDistance([
          5 || this.props.updater.input?.radius,
          this.state.lat || this.props.updater.input?.lat,
          this.state.long || this.props.updater.input?.long,
        ]))

    }
    const changeDropDownOption = async e => {
      e.preventDefault();

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showLocation)

      activeOptions.forEach(o => {
        updater.removeFilter(o);
      });
      
    }
     
    };

    const checkOption = (bucket, field) => {
      if (updater.isSelected(bucket)) {
        activeOptions.push(bucket);
        if (this.state.activeOption !== activeOptions[0]) {
          this.setState({
            activeOption: activeOptions[0],
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
    console.log("Buckets", buckets)
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
            {buckets.map(bucket => checkOption(bucket, field))}
          </StyledFormControl>
        </div>
      );
  }
}

export default withAggContext(DistanceDropDownOptions);
