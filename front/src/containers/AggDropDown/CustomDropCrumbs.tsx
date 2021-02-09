import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import * as FontAwesome from 'react-fontawesome';
import { AggBucket } from '../SearchPage/Types';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { BeatLoader } from 'react-spinners';

interface CustomDropCrumbsProps {
  field: SiteViewFragment_search_aggs_fields | any;
  isSelected: any;
  updater: AggFilterInputUpdater;
  selectedItems: any[];
  selectItem: any;

}
interface CustomDropCrumbsState {
  showAdditionalCrumbs: boolean;
}


class CustomDropCrumbs extends React.Component<CustomDropCrumbsProps, CustomDropCrumbsState> {
  state = {
    showAdditionalCrumbs: false
  };
  rangeText = () => {
    let range = this.props.selectedItems[0]
    if (!this.props.selectedItems) return
    console.log(1)
    //@ts-ignore
    if (!range.start) return `≤ ${range.end}`
    console.log(2, range)
    //@ts-ignore
    if (!range.end) return `≥ ${range.start}`
    console.log(3)
    //@ts-ignore
    return `${range.start} - ${range.end}`
  }
  renderLocationLabel = () => {
    let location = this.props.selectedItems[0]
    //@ts-ignore
    if (!location.zipcode && !location.radius) return
    //@ts-ignore
    if (!location.zipcode) return `Within ${location.radius} of current location`
    //@ts-ignore
    if (!location.lat && !location.long) return `Within ${location.radius} of ${location.zipcode}`

  }

  render() {
    const { field } = this.props

    if (this.props.selectedItems.length > 0) {

      let displayedCrumbs: any[] = this.props.selectedItems.slice(0, field.maxCrumbs)
      let otherValues = { key: `... ${this.props.selectedItems.length - displayedCrumbs.length} others` }
      displayedCrumbs.push(otherValues)
      if (field.maxCrumbs == 0 || field.maxCrumbs == null || !field) return<span></span>
      //the fields in the if block below technically will only ever have one crumb 
      //so we pop the last index which holds our "... and others" to prevent a duplicate crumb
      if (
        field?.display === FieldDisplay.DATE_RANGE ||
        field?.display === FieldDisplay.NUMBER_RANGE ||
        field?.display === FieldDisplay.LESS_THAN_RANGE ||
        field?.display === FieldDisplay.GREATER_THAN_RANGE ||
        field?.display === FieldDisplay.GREATER_THAN_DROP_DOWN ||
        field?.display === FieldDisplay.LOCATION
      ) {
        displayedCrumbs.pop()
      }

      return displayedCrumbs.map((item: AggBucket, index) => {
        if (
          field?.display === FieldDisplay.DATE_RANGE ||
          field?.display === FieldDisplay.NUMBER_RANGE ||
          field?.display === FieldDisplay.LESS_THAN_RANGE ||
          field?.display === FieldDisplay.GREATER_THAN_RANGE ||
          field?.display === FieldDisplay.GREATER_THAN_DROP_DOWN
        ) {
          if (this.props.selectedItems[0].key) return
          if (!this.props.selectedItems[0].start && !this.props.selectedItems[0].end && !this.props.selectedItems[0].key) return <BeatLoader />

          return (
            <div className='select-box--crumb-container' key={item.key + "crumb-container"}>
              {this.rangeText()}
              <FontAwesome
                className="remove crumb-icon"
                name="remove"
                onClick={() => this.props.updater.removeRange()}
              />
            </div>
          )

        } else if (field.display == FieldDisplay.LOCATION) {
          //console.log("IN LOCATION", field.display)
          if (!this.props.selectedItems[0].radius) return

          return (
            <div key={"location-crumb"} className='select-box--crumb-container' >
              {this.renderLocationLabel()}
              <FontAwesome
                className="remove crumb-icon"
                name="remove"
                onClick={() => this.props.updater.removeDistance()}
              />
            </div>
          )
        } else if (field?.display === FieldDisplay.BAR_CHART || field?.display === FieldDisplay.PIE_CHART) {
        }

        if (this.props.isSelected(item.key)) {
          return <div className='select-box--crumb-container' key={item.key + 'isSelected'}>
            {item.key}
            <FontAwesome
              className="remove crumb-icon"
              name="remove"
              onClick={() => this.props.selectItem(item)}
            />
          </div>
        }
        if (this.props.selectedItems.length > field.maxCrumbs) {
          let chevronDirection = this.state.showAdditionalCrumbs ? 'left' : 'right';
          if (this.state.showAdditionalCrumbs) {
            let otherCrumbs: any[] = this.props.selectedItems.slice(field.maxCrumbs, this.props.selectedItems.length)
            otherCrumbs.push({key:"<" })
            return otherCrumbs.map(item => {
          if(item.key=="<"){              
              return (
                <div className='select-box--crumb-container' key={item.key}>
                  <FontAwesome
                className={`chevron-${chevronDirection} crumb-icon`}
                name={`chevron-${chevronDirection}`}
                onClick={() => this.setState({ showAdditionalCrumbs: !this.state.showAdditionalCrumbs })}
                  />
                </div>)}
              return (
                <div className='select-box--crumb-container' key={item.key}>
                  {item.key}
                  <FontAwesome
                    className={`remove crumb-icon`}
                    name={`remove`}
                    onClick={() => this.props.selectItem(item)}
                  />
                </div>)
            })
          }
          return (
            <div className='select-box--crumb-container'>
              {item.key}
              <FontAwesome
                className={`chevron-${chevronDirection} crumb-icon`}
                name={`chevron-${chevronDirection}`}
                onClick={() => this.setState({ showAdditionalCrumbs: !this.state.showAdditionalCrumbs })}
              />
            </div>
          )
        }
      });
    } else {
      //console.log("else", this.props.field.displayName)
      return (<div className={"select-box--sublabel"}>{this.props.field.aggSublabel}</div>)
    }
  }
};


export default withAggContext(CustomDropCrumbs);