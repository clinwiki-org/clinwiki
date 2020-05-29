import * as React from 'react';
import CurrentUser from 'containers/CurrentUser';
import ExportToCsvButton from './ExportToCsvButton';
import ExportToCsvDialog from './ExportToCsvDialog';


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

    const setExportId = exportId => this.setState({ exportId });

    return (
      <>
        <CurrentUser>
          {user => (
            <ExportToCsvButton
              siteView={this.props.siteView}
              searchHash={this.props.searchHash}
              setExportId={setExportId}
              user={user}
            />
          )}
        </CurrentUser>
        {exportId !== null ? (
          <ExportToCsvDialog exportId={exportId} setExportId={setExportId} />
        ) : null}
      </>
    );
  }
}

export default ExportToCsvComponent;
