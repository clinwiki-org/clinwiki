import * as React from 'react';
import {
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import ThemedButton from 'components/StyledComponents';
import { connect } from 'react-redux';
import {
  propEq,
  findIndex,
  find,
  filter
} from 'ramda';
import { updateSearchParamsAction } from 'services/search/actions'

interface RangeSelectorProps {
  isOpen: boolean;
  hasMore: boolean;
  loading: boolean;
  buckets: Array<AggBucket>;
  handleLoadMore: () => void;
  updater: AggFilterInputUpdater;
  aggType: FieldDisplay;
  field: any;
  handleRange: ([]) => void;
  searchResultData: any;
  updateSearchParamsAction: any;

}

interface RangeSelectorState {
  start?: any;
  end?: any;
  startText?: any;
  endText?: any;
}

class RangeSelector extends React.Component<
  RangeSelectorProps,
  RangeSelectorState
> {
  constructor(props) {
    super(props);
    this.state = {
      startText: "",
      endText: "",
    };
  }
  componentDidMount = () => {
    const searchParams = this.props.searchResultData?.data?.searchParams.searchParams;

    const grouping = this.props.field.aggKind == "crowdAggs" ? 'crowdAggFilters' : 'aggFilters';

    const aggSettings = find(
      (x) => x.field == this.props.field.name,
      searchParams[grouping]
    );
    // console.log(aggSettings)
    aggSettings && this.setState({ startText: aggSettings.gte, endText: aggSettings.lte })
    // let showAlternate= true
    // if(showAlternate){
    //   this.setState({startText: 'Greater Than or Equal to:'})
    // }
  };
  onChange = () => {
    const grouping = this.props.field.aggKind == "crowdAggs" ? 'crowdAggFilters' : 'aggFilters';

    const searchParams = this.props.searchResultData?.data?.searchParams;
    const aggSettings = find(
      (x) => x.field == this.props.field.name,
      searchParams[grouping]
    );

    const allButThisAgg = filter(
      (x) => x.field !== this.props.field.name,
      searchParams[grouping] || aggSettings
    );
    if (searchParams[grouping] && aggSettings) {
      console.log("Zettings", aggSettings)
      console.log(this.state)

      let newInput = {
        field: this.props.field.name,
        values: aggSettings?.values,
        gte: this.state.startText || aggSettings?.gte || null,
        lte: this.state.endText || aggSettings?.lte || null,
        includeMissingFields: aggSettings?.includeMissingFields || null,
        zipcode: aggSettings?.zipcode || null,
        radius: aggSettings?.radius || null,
        lat: aggSettings?.lat || null,
        long: aggSettings?.long || null
      }
      const currentParams = { ...searchParams, [grouping as string]: [...allButThisAgg, newInput], q: JSON.parse(searchParams.q) }

      this.props.updateSearchParamsAction(currentParams);
    } else {
      let newInput = {
        field: this.props.field.name,
        values: aggSettings?.values,
        gte: this.state.startText || aggSettings?.gte || null,
        lte: this.state.endText || aggSettings?.lte || null,
        includeMissingFields: aggSettings?.includeMissingFields || null,
        zipcode: aggSettings?.zipcode || null,
        radius: aggSettings?.radius || null,
        lat: aggSettings?.lat || null,
        long: aggSettings?.long || null
      }
      const currentParams = { ...searchParams, [grouping as string]: [...allButThisAgg, newInput], q: JSON.parse(searchParams.q) }
      this.props.updateSearchParamsAction(currentParams);
    }
  };
  render() {
    const { aggType, field } = this.props;
    const { startText, endText } = this.state;

    const startLabel = (field && field.rangeStartLabel) || 'Start';
    const endLabel = (field && field.rangeEndLabel) || 'End';
    if (aggType === FieldDisplay.GREATER_THAN_RANGE) {
      return (
        <Col className="range-selector">
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.setState(
                { ...this.state, start: startText, end: endText },
                this.onChange
              );
            }}>
            <FormGroup>
              <ControlLabel>{startLabel}</ControlLabel>
              <FormControl
                type={'text'}
                value={startText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    startText: e.target.value,
                  })
                }
                onBlur={() =>
                  this.setState(
                    { ...this.state, start: startText },
                    this.onChange
                  )
                }></FormControl>
            </FormGroup>
            {/* this is a placebo, it's really done on onblur */}
            <ThemedButton type="submit">Enter</ThemedButton>
          </Form>
        </Col>
      );
    } else if (aggType === FieldDisplay.LESS_THAN_RANGE) {
      return (
        <Col className="range-selector">
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.setState(
                { ...this.state, start: startText, end: endText },
                this.onChange
              );
            }}>
            <FormGroup>
              <ControlLabel>{endLabel}</ControlLabel>
              <FormControl
                type={'text'}
                value={endText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    endText: e.target.value,
                  })
                }
                onBlur={() =>
                  this.setState({ ...this.state, end: endText }, this.onChange)
                }></FormControl>
            </FormGroup>
            <FormGroup>
              {/* this is a placebo, it's really done on onblur */}
              <ThemedButton type="submit">Enter</ThemedButton>
            </FormGroup>
          </Form>
        </Col>
      );
    } else {
      return (
        <Col className="range-selector">
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.setState(
                { ...this.state, start: startText, end: endText },
                this.onChange
              );
            }}>
            <FormGroup>
              <ControlLabel>{startLabel}</ControlLabel>
              <FormControl
                type={aggType === FieldDisplay.DATE_RANGE ? 'date' : 'text'}
                value={startText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    startText: e.target.value,
                  })
                }
                onBlur={() =>
                  this.setState(
                    { ...this.state, start: startText },
                    this.onChange
                  )
                }></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>{endLabel}</ControlLabel>
              <FormControl
                type={aggType === FieldDisplay.DATE_RANGE ? 'date' : 'text'}
                value={endText}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    endText: e.target.value,
                  })
                }
                onBlur={() =>
                  this.setState({ ...this.state, end: endText }, this.onChange)
                }></FormControl>
            </FormGroup>
            <FormGroup>
              {/* this is a placebo, it's really done on onblur */}
              <ThemedButton type="submit">Enter</ThemedButton>
            </FormGroup>
          </Form>
        </Col>
      );
    }
  }
}
const mapStateToProps = (state, ownProps) => ({
  searchResultData: state.search.searchResults,
})
const mapDispatchToProps = (dispatch) => ({
  updateSearchParamsAction: (variables?) => dispatch(updateSearchParamsAction(variables)),

})
export default connect(mapStateToProps, mapDispatchToProps)(withAggContext(RangeSelector));
