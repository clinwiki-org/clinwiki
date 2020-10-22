import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';


interface BucketsProps {
display: FieldDisplay;
visibleOptions: any;
buckets: Array<AggBucket>;
isSelected: any;
updater: AggFilterInputUpdater;
field: any;
agg: string;
}

const StyledFormControl = styled(FormControl)`
margin-bottom: 20px;
border-radius: 2px;
border-color: "red";
`;

class BucketsDropDownOptions extends React.Component<BucketsProps> {
    render() {
    const { 
        display, 
        buckets, 
        visibleOptions = [], 
        updater, 
        field, 
        agg 
    } = this.props;

    let activeOptions: string[] = [];

    const changeDropDownOption = async (e) => {
        activeOptions.forEach(o => {
            updater.removeFilter(o);
            } 
        )
        updater.toggleFilter(e.target.value)
    }

    const checkOption = (bucket) => {
    if (updater.isSelected(bucket.key)){
        activeOptions.push(bucket.key)
    };
       //console.log("active", activeOptions)
        return (
        <option
        value={bucket.key}>
            {defaultTo(bucket.key)(bucket.keyAsString)} ({bucket.docCount})
        </option>
        )
    }

     console.log("Active Opt", (activeOptions.length !== 0))
    console.log("Active Opt", activeOptions)
     const selectedOption = (activeOptions === undefined || activeOptions.length === 0)
    ?
    "Select Option" : activeOptions; 

    console.log("!!!!!!!!!!", selectedOption)
  
    return (
        <div className="dropDownFacet">
        <StyledFormControl
        //multiple
       // name={activeOptions[0]}
        componentClass={"select"}
        //defaultValue={"Option"}
        value={-1}
        //placeholder={"Options"}
        onChange={ (e) => changeDropDownOption(e)}
        >
          <option value={-1} key={-1}>{activeOptions}</option>
        {buckets
        .filter(
            bucket =>
                !bucketKeyIsMissing(bucket) &&
                (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
        )
        .map(bucket => (
                checkOption(bucket)
        )
        )
        }
        </StyledFormControl>
        </div>
            )
    }
}

export default withAggContext(BucketsDropDownOptions);