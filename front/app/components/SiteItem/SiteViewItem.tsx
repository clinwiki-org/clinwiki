import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Button } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";
import { withRouter} from 'react-router-dom';
import { match } from "react-router";
import { trimPath } from "utils/helpers";
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn
} from "mutations/DeleteSiteViewMutation";

interface SiteViewItemProps {
  match: match<{}>;
  history: History;
  location: Location;
  refresh: () => void;
  siteView: SiteViewFragment;
  onAddMutation: (e: { currentTarget: { name: string; value: any } }) => void;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  handleEditClick = () => {
    console.log('firing', this.props.siteView)
    const siteViewId = this.props.siteView.id;
     //  @ts-ignore
    const siteId = this.props.match.params.id
     //  @ts-ignore
    this.props.history.push(`/sites/${siteId}/edit/siteviews/${siteViewId}/edit`)
 }

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
      this.props.refresh();
    });
  }
};
  render() {
    const id = this.props.siteView.id;
    console.log(this.props);
    const url = trimPath(this.props.match.url);
    const path = trimPath(this.props.match.path);
    console.log(url, path);

    return (
      <tr>
        <td>{this.props.siteView.name}</td>
        <td>{this.props.siteView.url}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          <StyledButton>Delete</StyledButton>
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
