import * as React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";
import { withRouter } from "react-router-dom";
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn
} from "mutations/DeleteSiteViewMutation";
import { History, Location } from "history";

interface SiteViewItemProps {
  match: any;
  history: History;
  location: Location;
  refresh: () => void;
  siteView: SiteViewFragment;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleEditClick = () => {
    const siteViewId = this.props.siteView.id;
    const siteId = this.props.match.params.id;
    this.props.history.push(
      `/sites/${siteId}/edit/siteviews/${siteViewId}/edit`
    );
  };

  handleDelete = (deleteSiteView: DeleteSiteViewMutationFn) => {
    if (!window) return;
    if (window.confirm("Are you sure?")) {
      deleteSiteView({
        variables: {
          input: {
            id: this.props.siteView.id
          }
        }
      }).then(res => {
        // console.log(res);
        this.props.refresh();
      });
    }
  };
  render() {
    return (
      <tr>
        <td>{this.props.siteView.name}</td>
        <td>{this.props.siteView.url}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
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

//@ts-ignore
export default withRouter(SiteViewItem);
