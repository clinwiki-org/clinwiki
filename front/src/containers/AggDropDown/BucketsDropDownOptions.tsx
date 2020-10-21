import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { withSearchParams } from 'containers/SearchPage/components/SearchParamsContext';


interface BucketsProps {
display: FieldDisplay;
visibleOptions: any;
buckets: Array<AggBucket>;
isSelected: any;
updater: AggFilterInputUpdater;
field: any;
searchParams: any;
removeFilters: any;
agg: string;
}

const StyledFormControl = styled(FormControl)`
margin-bottom: 20px;
border-radius: 2px;
border-color: "red";
`;

let prevOption = "";

class BucketsDropDownOptions extends React.Component<BucketsProps> {
    render() {
    const { 
        display, 
        buckets, 
        visibleOptions = [], 
        updater, 
        field, 
        searchParams, 
        removeFilters,
        agg 
    } = this.props;

    console.log("SearchParams",searchParams)
    

    const changeDropDownOption = async (e) => {
        let newParams: string[] = [];

        buckets.map(({ key }) => {
          newParams.push(key);
        });

        //if (prevOption !== "") {updater.removeFilter(prevOption)}
        //prevOption = e.target.value;

        console.log("AGG", agg)
        console.log("newParams", newParams)
        removeFilters(agg, newParams);

        updater.toggleFilter(e.target.value)
    }

    //console.log("BUCKETS", buckets)

    return (
        <StyledFormControl
        name={"Name"}
        componentClass="select"
        onChange={ (e) => changeDropDownOption(e)}
// TODO Need to unselect/toggle previous options to have only one dropdown option at a time
        defaultValue={field.display}
        >
        {buckets
        .filter(
            bucket =>
                !bucketKeyIsMissing(bucket) &&
                (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
        )
        .map(bucket => (
                <option value={bucket.key}>
                    {defaultTo(bucket.key)(bucket.keyAsString)} ({bucket.docCount})
                </option>
        )
        )
        }
        </StyledFormControl>
            )
    }
}
  
export default withSearchParams(withAggContext(BucketsDropDownOptions));