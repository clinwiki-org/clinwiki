import * as React from 'react';
import gql from 'graphql-tag';
import { SiteFragment_siteView } from 'types/SiteFragment';
import ExportToCsvButton from './ExportToCsvButton';
import ExportToCsvDialog from './ExportToCsvDialog';

const SEARCH_EXPORT_QUERY = gql`
  query SearchExportQuery($searchExportId: Int!) {
    searchExport(searchExportId: $searchExportId) {
      downloadUrl
    }
  }
`;

interface ExportToCsvComponentProps {
  siteView: any;
  searchHash: string;
}

interface ExportToCsvComponentState {
  exportId?: Number | null;
}

class ExportToCsvComponent extends React.Component<
  ExportToCsvComponentProps,
  ExportToCsvComponentState
> {
  state = { exportId: null };
  render() {
    const { exportId } = this.state;

    console.log(exportId);

    const setExportId = exportId => this.setState({ exportId });

    return (
      <>
        <ExportToCsvButton
          siteView={this.props.siteView}
          searchHash={this.props.searchHash}
          setExportId={setExportId}
        />
        {exportId !== null ? (
          <ExportToCsvDialog exportId={exportId} setExportId={setExportId} />
        ) : null}
      </>
    );
  }
}

export default ExportToCsvComponent;
