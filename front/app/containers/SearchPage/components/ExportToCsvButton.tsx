import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as FontAwesome from 'react-fontawesome';
import { SiteFragment_siteView } from 'types/SiteFragment';
import ThemedButton from 'components/StyledComponents/index';

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
}

class ExportToCsvButton extends React.Component<ExportToCsvButtonProps> {
  render() {
    const { mutate, siteView, searchHash, setExportId } = this.props;

    async function onClick() {
      const { data } = await mutate({
        variables: { siteViewId: siteView.id, searchHash },
      });
      console.log(data);
      setExportId(data.exportToCsv.searchExport.id);
    }
    return (
      <ThemedButton onClick={onClick}>
        Export to CSV &nbsp;
        <FontAwesome name="file-text" />
      </ThemedButton>
    );
  }
}

// it's a little annoying that the HOC expects so many types
export default graphql<any, any, any, any>(EXPORT_TO_CSV_MUTATION)(
  ExportToCsvButton
);
