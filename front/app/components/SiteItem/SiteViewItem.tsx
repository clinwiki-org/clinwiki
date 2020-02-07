import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Button } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";
import DeleteSiteViewMutation, {
  DeleteSiteViewMutationFn
} from "mutations/DeleteSiteViewMutation";
import { History, Location } from "history";
import { Switch, Route, match, Redirect } from "react-router";
import { capitalize, trimPath } from "utils/helpers";
import SiteViewEdit from "containers/SiteViewsPage/SiteViewEdit/SiteViewEdit";

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
          <StyledButton
            onClick={() => {
              this.props.history.push(`${url}/${id}/site_view_edit`);
            }}
          >
            Edit
          </StyledButton>
          <DeleteSiteViewMutation>
            {deleteSiteView => (
              <StyledButton onClick={() => this.handleDelete(deleteSiteView)}>
                Delete
              </StyledButton>
            )}
          </DeleteSiteViewMutation>
        </td>
        <Switch>
          <Route
            path={`${path}/:id/site_view_edit`}
            render={() => (
              <SiteViewEdit
                history={this.props.history}
                location={this.props.location}
                match={this.props.match}
                view={this.props.siteView}
                onAddMutation={this.props.onAddMutation}
                id={id}
              />
            )}
          />
          {/* <Redirect to={`${path}`} /> */}
        </Switch>
      </tr>
    );
  }
}

export default SiteViewItem;
