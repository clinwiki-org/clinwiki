import * as React from 'react';
import { Modal } from 'react-bootstrap';
import ThemedButton from 'components/StyledComponents/index';
import { connect } from 'react-redux';
import { searchExport } from 'services/search/actions';

interface ExportToCsvDialogProps {
  exportId?: Number;
  data: any;
  loading: boolean;
  setExportId: any;
  searchExport: any;
  searchExportToCsv: any;
  setShowExportModal: any;
}

class ExportToCsvDialog extends React.Component<ExportToCsvDialogProps> {

  componentDidMount(){
    this.props.searchExportToCsv(this.props.exportId)
  }

/*   componentWillMount() {
    this.props.data.startPolling(250);
  } */

  render() {
    const { setExportId, loading, searchExport } = this.props;
    //console.log("🚀 ~ ren SearchExport data", searchExport);
    let body = <div />;
    const noDownloadUrl =
      searchExport?.downloadUrl === null ||
      searchExport?.downloadUrl === undefined;
    if (loading || noDownloadUrl) {
      body = <span>Your export is running...</span>;
    } else {
      const openDownloadUrl = () => {
        window.open(searchExport.downloadUrl);
        //data.stopPolling();
        setExportId(null);
        this.props.setShowExportModal(false);
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
            <ThemedButton onClick={() => this.props.setShowExportModal(false)}>Close</ThemedButton>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  searchExportToCsv: (searchExportId) => dispatch(searchExport(searchExportId)),
})

const mapStateToProps = (state, ownProps) => ({
  searchExport: state.search.searchExport,
})

export default connect(mapStateToProps, mapDispatchToProps ) (ExportToCsvDialog);