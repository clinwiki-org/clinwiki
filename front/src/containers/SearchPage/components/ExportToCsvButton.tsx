import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';

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
  render() {
    const { mutate, siteView, searchHash, setExportId, user } = this.props;
    const { showLoginModal } = this.state;

    const setShowLoginModal = showLoginModal => {
      this.setState({ showLoginModal });
    };

    async function onClick() {
      if (user) {
        const { data } = await mutate({
          variables: { siteViewId: siteView.id, searchHash },
        });
        setExportId(data.exportToCsv.searchExport.id);
      } else {
        setShowLoginModal(true);
      }
    }
    return (
      <>
        <LoginModal
          show={showLoginModal}
          cancel={() => setShowLoginModal(false)}
        />
        <ThemedButton onClick={onClick}>
            &nbsp;
            <FontAwesome name="download" />
            &nbsp;
        </ThemedButton>
      </>
    );
  }
}

// it's a little annoying that the HOC expects so many types
export default graphql<any, any, any, any>(EXPORT_TO_CSV_MUTATION)(
  ExportToCsvButton
);
