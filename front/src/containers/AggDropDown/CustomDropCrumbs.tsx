import * as React from 'react';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { applyTemplate,compileTemplate } from '../../components/MailMerge/MailMergeView';
import * as FontAwesome from 'react-fontawesome';
import { AggBucket } from '../SearchPage/Types';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { BeatLoader } from 'react-spinners';
import { updateSearchParamsAction } from 'services/search/actions'
import { filter } from 'ramda';
import { connect } from 'react-redux';
import HtmlToReact from 'html-to-react';

interface CustomDropCrumbsProps {
  field: SiteViewFragment_search_aggs_fields | any;
  isSelected: any;
  updater: AggFilterInputUpdater;
  selectedItems: any[];
  selectItem: any;
  searchResultData: any;
  updateSearchParamsAction: any;
  buckets: any;

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
    //@ts-ignore
    if (!range.start) return `≤ ${range.end}`
    //@ts-ignore
    if (!range.end) return `≥ ${range.start}`
    //@ts-ignore
    return `${range.start} - ${range.end}`
  }
  renderLocationLabel = () => {
    let location = this.props.selectedItems[0]
    //@ts-ignore
    if (!location.zipcode && !location.radius) return
    //@ts-ignore
    if (!location.zipcode) return `Within ${location.radius} miles of current location`
    //@ts-ignore
    if (!location.lat && !location.long) return `Within ${location.radius} miles of ${location.zipcode}`

  }
  removeFilter = (aggName, isCrowd) => {
    const searchParams = this.props.searchResultData?.data?.searchParams.searchParams;

    const grouping = isCrowd ? 'crowdAggFilters' : 'aggFilters';

    const allButThisAgg = filter(
      (x) => x.field !== aggName,
      searchParams[grouping]
    );

    let newParams = isCrowd ? {
      ...searchParams,
      crowdAggFilters: allButThisAgg

    } : {
      ...searchParams,
      aggFilters: allButThisAgg

    }
    this.props.updateSearchParamsAction(newParams);

  }
  renderCrumbTemplate = (item) => {
    let crumbContext = {
      crumb: item.key,
      docCount: item.docCount
    };

    const { crumbTemplate } = this.props.field;
    console.log("Cookie crumb", crumbTemplate);

    const DEFAULT_BUCKET_TEMPLATE = `<div className='select-box--crumb-container'>
    <i class='fas fa-remove'></i> {{crumb}}
    </div>`;

    const compiled = compileTemplate(crumbTemplate || DEFAULT_BUCKET_TEMPLATE)

    const raw = applyTemplate(compiled, crumbContext)
    console.log(raw)
    const parser = new HtmlToReact.Parser();
    console.log(crumbContext)
    const reactElementHelperText = parser.parse(raw)

    return (
      <span className={this.props.isSelected(item.key) ? "select-box--crumb-container-disabled-pointer" : "select-box--crumb-container-pointer"}
        onClick={() => this.props.selectItem(item)}>
        {reactElementHelperText}</span>

    )

  }
  render() {
    const { field } = this.props


    if (this.props.selectedItems.length > 0 && field.display !=="BTNCLOUD") {
      //console.log("CRUMBS PROPS", field.name, this.props.selectedItems)
      let displayedCrumbs: any[] = this.props.selectedItems.slice(0, field.maxCrumbs)
      let otherValues = { key: `... ${this.props.selectedItems.length - displayedCrumbs.length} others` }
      displayedCrumbs.push(otherValues)
      if (field.maxCrumbs == 0 || field.maxCrumbs == null || !field) return <span></span>
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
                onClick={() => this.removeFilter(field.name, field.aggKind == "crowdAgg")}
              />
            </div>
          )

        } else if (field.display == FieldDisplay.LOCATION) {
          if (!this.props.selectedItems[0].radius) return

          return (
            <div key={"location-crumb"} className='select-box--crumb-container' >
              {this.renderLocationLabel()}
              <FontAwesome
                className="remove crumb-icon"
                name="remove"
                onClick={() => this.removeFilter(field.name, field.aggKind == "crowdAgg")}
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
            otherCrumbs.push({ key: "<" })
            return otherCrumbs.map(item => {
              if (item.key == "<") {
                return (
                  <div className='select-box--crumb-container' key={item.key}>
                    <FontAwesome
                      className={`chevron-${chevronDirection} crumb-icon`}
                      name={`chevron-${chevronDirection}`}
                      onClick={() => this.setState({ showAdditionalCrumbs: !this.state.showAdditionalCrumbs })}
                    />
                  </div>)
              }
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
    }
    
    else if(field.display=="BTNCLOUD" && this.props.buckets){
      console.log("ARRAY Buckets", this.props.buckets)
      let arrayToSlice =   this.props.buckets
      console.log("ARRAY TO SLICE", arrayToSlice)
      let displayedCrumbs: any[] = arrayToSlice.slice(0, field.maxCrumbs);
      console.log(displayedCrumbs)
       
      if(!displayedCrumbs.map){

        return <span>BTN</span>
      } else{
         return displayedCrumbs.map((item,index)=>{
            return this.renderCrumbTemplate(item)
          }) 
        // return <span>BTN2</span>
      }
    } 
    
    else {
      console.log("else", this.props.field.displayName)
      return (<div className={"select-box--sublabel"}>{this.props.field.aggSublabel}</div>)
    }
  }
};

const mapStateToProps = (state, ownProps) => ({
  searchResultData: state.search.searchResults,
})
const mapDispatchToProps = (dispatch) => ({
  updateSearchParamsAction: (variables?) => dispatch(updateSearchParamsAction(variables)),

})
export default connect(mapStateToProps, mapDispatchToProps)(withAggContext(CustomDropCrumbs));
