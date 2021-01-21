import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket, AggregateAggCallback } from '../SearchPage/Types';
import { FormControl, FormGroup } from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';
import DistanceDropDownOptions from './DistanceDropDownOptions';
import LabeledButton from 'components/LabeledButton';
import AggFilterInputUpdater from '../SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from '../SearchPage/components/AggFilterUpdateContext';

interface LocationAggProps {
  updater: AggFilterInputUpdater;
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: Array<AggBucket>;
  isSelected: ()=> boolean;
  removeFilters:  AggregateAggCallback | undefined;
  agg: string;
  handleLocation: ([])=>void
}
interface LocationAggState {
  zipcode?:  string | null,
  radius?: string | null,
  lat: number | null,
  long: number | null,
}

class LocationAgg extends React.Component<LocationAggProps, LocationAggState> {

  constructor(props) {
    super(props);
    this.state = {
      zipcode: this.props.updater.input?.zipcode,
      radius: this.props.updater.input?.radius,
      lat: null,
      long: null,
    };
  }
  showLocation = (position) => {
    this.setState({ lat: position.coords.latitude, long: position.coords.longitude, zipcode: null, radius: this.state.radius },
      () => this.props.updater.changeDistance([
        this.state.zipcode,
        this.state.lat || this.props.updater.input?.lat,
        this.state.long || this.props.updater.input?.long,
        this.state.radius|| this.props.updater.input?.radius || '50',
      ])
    )
this.props.handleLocation([
  { zipcode: this.state.zipcode,
    lat: this.state.lat || this.props.updater.input?.lat,
    long: this.state.long || this.props.updater.input?.long,
    radius: this.state.radius|| this.props.updater.input?.radius || '50',}
])
  }
  handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showLocation)
    }
  }
  handleZipcode = () => {
    this.setState({ zipcode: this.state.zipcode, lat: null, long: null, radius: this.state.radius},
      () => this.props.updater.changeDistance([
        this.state.zipcode || this.props.updater.input?.zipcode,
        this.state.lat,
        this.state.long,
        this.state.radius|| this.props.updater.input?.radius|| '50',
      ])

    )
    this.props.handleLocation([
      { zipcode: this.state.zipcode,
        lat: this.state.lat || this.props.updater.input?.lat,
        long: this.state.long || this.props.updater.input?.long,
        radius: this.state.radius|| this.props.updater.input?.radius || '50',}
      ])
  }
  render() {
    const {
      field,
      isSelected,
      removeFilters,
      agg
    } = this.props;
    const buckets: number[] = [5, 10, 25, 50, 100, 250, 500, 1000]
    return (
      <>
        <FormGroup style={{marginTop:'1.5em'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderBottom: 'solid 2px #ddd',
              alignItems: 'center',
            }}>
            <div
              style={{
                flex: 2,
                justifyContent: 'space-around',
                alignItems: 'center',
                display: 'flex',
              }}>
              <LabeledButton
                helperText={"Use Current Location"}
                theClick={this.handleCurrentLocation}
                iconName={"compass"}
              />
            </div>
            <FormControl
              type="text"
              placeholder="Enter Zip Code"
              value={this.state.zipcode}
              onChange={e =>
                this.setState({
                  zipcode: e.target.value,
                })}
              onBlur={() => this.handleZipcode()
              }
              style={{ flex: 4, margin: '4px' }}
            />
          </div>


          <DistanceDropDownOptions
            removeFilters={removeFilters}
            display={(field && field.display) || FieldDisplay.STRING}
            buckets={buckets}
            isSelected={isSelected}
            field={field}
            agg={agg}
            zipcode={this.state.zipcode || '50'}
          />
        </FormGroup>
        <FormGroup>
          {/* this is a placebo, it's really done on onblur */}
          <ThemedButton type="submit">Enter</ThemedButton>
        </FormGroup>
      </>
    );
  }
}

export default withAggContext(LocationAgg);