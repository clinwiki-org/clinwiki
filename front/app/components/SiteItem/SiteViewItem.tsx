import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Button } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";
import { Route , withRouter} from 'react-router-dom';

interface SiteViewItemProps {
  // onEdit: (id: number) => void | null;
  // onDelete?: (id: number) => void | null;
  siteView: SiteViewFragment;
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
  render() {
    return (
      <tr>
        <td>{this.props.siteView.name}</td>
        <td>{this.props.siteView.url}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          <StyledButton>Delete</StyledButton>
        </td>
      </tr>
    );
  }
}

//@ts-ignore
export default withRouter(SiteViewItem);
