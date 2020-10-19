import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import { Checkbox } from 'react-bootstrap';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import Bucket from './Bucket';
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
}

const StyledFormControl = styled(FormControl)`
margin-bottom: 20px;
border-radius: 2px;
border-color: "red";
`;

class BucketsDropDownOptions extends React.Component<BucketsProps> {
    render() {
    const { display, buckets, visibleOptions = [], updater, field } = this.props;

    console.log("BUCKETS", buckets)

    return (
        <StyledFormControl
        name={"Name"}
        componentClass="select"
        onChange={(e) => updater.toggleFilter(e.target.value)}
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

export default withAggContext(BucketsDropDownOptions);