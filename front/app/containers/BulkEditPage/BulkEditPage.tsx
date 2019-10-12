import * as React from 'react';
import { path } from 'ramda';

interface BulkEditProps {
    match: any
}
interface BulkEditState {
}

class BulkEditPage extends React.Component<BulkEditProps, BulkEditState> {
    render() {
        const hash = path(['match', 'params', 'searchId'], this.props) as string | null;
        return <div>hash={hash}</div>
    }
}

export default BulkEditPage;