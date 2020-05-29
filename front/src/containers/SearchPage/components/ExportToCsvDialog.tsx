import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Modal } from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';

const SEARCH_EXPORT_QUERY = gql`
  query SearchExportQuery($searchExportId: Int!) {
    searchExport(searchExportId: $searchExportId) {
      downloadUrl
    }
  }
`;

interface ExportToCsvDialogProps {
  exportId?: Number;
  data: any;
  loading: boolean;
  setExportId: any;
}

class ExportToCsvDialog extends React.Component<ExportToCsvDialogProps> {
  componentWillMount() {
    this.props.data.startPolling(250);
  }

  render() {
    const { setExportId, loading, data } = this.props;

    let body = <div />;
    const noDownloadUrl =
      data?.searchExport?.downloadUrl === null ||
      data?.searchExport?.downloadUrl === undefined;
    if (loading || noDownloadUrl) {
      body = <span>Your export is running...</span>;
    } else {
      const openDownloadUrl = () => {
        window.open(data.searchExport.downloadUrl);
        data.stopPolling();
        setExportId(null);
      };
      body = (
        <ThemedButton onClick={openDownloadUrl}>Download Export</ThemedButton>
      );
    }

    return (
      <Modal show style={{ minHeight: '250px' }}>
        <Modal.Dialog style={{ minHeight: '250px' }}>
          <Modal.Header>
            <Modal.Title>Exporting to CSV</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ textAlign: 'center' }}>{body}</Modal.Body>

          <Modal.Footer>
            <ThemedButton onClick={() => setExportId(null)}>Close</ThemedButton>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
  }
}

export default graphql<any, any, any, any>(SEARCH_EXPORT_QUERY, {
  options: (props: any) => ({
    variables: { searchExportId: props.exportId },
  }),
})(ExportToCsvDialog);
