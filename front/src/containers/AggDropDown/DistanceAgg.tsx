// TODO  Component based in checkbox BucketsPanel
// Need to setup as dropdown

import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import { FormControl, FormGroup } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import DistanceDropDownOptions from './DistanceDropDownOptions';
import LabeledButton from 'components/LabeledButton';
import AggFilterInputUpdater from '../SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from '../SearchPage/components/AggFilterUpdateContext';


interface DistanceAggProps {
  isPresearch: boolean;
  updater: AggFilterInputUpdater;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  removeFilters: any;
  agg: string;
}
interface DistanceAggState {
  zipcode?: any;
  radius: any,
  lat: number | null,
  long: number | null,
}

class DistanceAgg extends React.Component<DistanceAggProps, DistanceAggState> {

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
    this.setState({ lat: position.coords.latitude, long: position.coords.longitude, zipcode: null },
      () => this.props.updater.changeDistance([
        this.state.zipcode,
        this.state.lat || this.props.updater.input?.lat,
        this.state.long || this.props.updater.input?.long,
      ])
    )

  }
  handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showLocation)
    }
  }
  handleZipcode = () => {
    this.setState({ zipcode: this.state.zipcode, lat: null, long: null },
      () => this.props.updater.changeDistance([
        this.state.zipcode || this.props.updater.input?.zipcode,
        this.state.lat,
        this.state.long
      ])

    )
  }
  render() {
    const {
      isPresearch,
      field,
      visibleOptions,
      isSelected,
      hasMore,
      removeFilters,
      agg
    } = this.props;
    const buckets: number[] = [5, 10, 25, 50, 100, 250, 500, 1000]
    return (
      <>
        <FormGroup>
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
              // value={"zipCode"}
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
            visibleOptions={visibleOptions}
            buckets={buckets}
            isSelected={isSelected}
            field={field}
            agg={agg}
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

export default withAggContext(DistanceAgg);