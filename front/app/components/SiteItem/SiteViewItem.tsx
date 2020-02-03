import * as React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Button } from 'react-bootstrap';
import { SiteViewFragment } from 'types/SiteViewFragment';
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn,
} from 'mutations/DeleteSiteViewMutation';

interface SiteViewItemProps {
  // onEdit: (id: number) => void | null;
  // onDelete?: (id: number) => void | null;
  refresh: () => void;
  siteView: SiteViewFragment;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleDelete = (deleteSiteView: DeleteSiteViewMutationFn) => {
    if (!window) return;
    if (window.confirm('Are you sure?')) {
      deleteSiteView({
        variables: {
          input: {
            id: this.props.siteView.id,
          },
        },
      }).then(res => {
        this.props.refresh();
      });
    }
  };
  // componentDidMount = () => {
  //   console.log(this.props.siteView);
  // };

  render() {
    return (
      <tr>
        <td>{this.props.siteView.name}</td>
        <td>{this.props.siteView.url}</td>
        <td>
          <StyledButton>Edit</StyledButton>
          <DeleteSiteViewMutation>
            {deleteSiteView => (
              <StyledButton onClick={() => this.handleDelete(deleteSiteView)}>
                Delete
              </StyledButton>
            )}
          </DeleteSiteViewMutation>
        </td>
      </tr>
    );
  }
}

export default SiteViewItem;
