import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from '@apollo/client/react/hoc';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';
import LabeledButton from 'components/LabeledButton';
import { connect } from 'react-redux';
import { ExportToCsv } from 'services/search/actions';
import { BeatLoader } from 'react-spinners';

//! TODO Remove
const EXPORT_TO_CSV_MUTATION = gql`
  mutation ExportToCsvMutation($searchHash: String!, $siteViewId: Int!) {
    exportToCsv(input: { searchHash: $searchHash, siteViewId: $siteViewId }) {
      searchExport {
        id
      }
    }
  }
`;

interface ExportToCsvButtonProps {
  siteView: any;
  searchHash: string;
  mutate: any;
  setExportId: any;
  user?: any;
  exportToCsv: any;
 // searchExport: any;
}

interface ExportToCsvButtonState {
  showLoginModal: boolean;
}

class ExportToCsvButton extends React.Component<
  ExportToCsvButtonProps,
  ExportToCsvButtonState
> {
  state = {
    showLoginModal: false,
  };

    setShowLoginModal = showLoginModal => {
      this.setState({ showLoginModal });
    };

    handleExportClick = () => {
      const { exportToCsv, siteView, searchHash, setExportId, user } = this.props;
      if (user) {
      exportToCsv(searchHash, siteView.id);

      //setExportId(searchExport.id);
    } else {
      this.setShowLoginModal(true);
    }
  }

  render() {
    const { showLoginModal } = this.state;
    return (
      <>
        <LoginModal
          show={showLoginModal}
          cancel={() => this.setShowLoginModal(false)}
        />
        <LabeledButton
          helperText={"Download CSV"}
          theClick={this.handleExportClick}
          iconName={"download"}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  exportToCsv: (searchHash, siteViewId) => dispatch(ExportToCsv(searchHash, siteViewId)),
})

const mapStateToProps = (state, ownProps) => ({
  //searchExport: state.search.searchExport,
})

export default connect(mapStateToProps, mapDispatchToProps ) (ExportToCsvButton);

