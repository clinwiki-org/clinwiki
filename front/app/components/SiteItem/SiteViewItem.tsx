import * as React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Button } from "react-bootstrap";
import { SiteViewFragment } from "types/SiteViewFragment";

interface SiteViewItemProps {
  // onEdit: (id: number) => void | null;
  // onDelete?: (id: number) => void | null;
  siteView: SiteViewFragment;
}

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

class SiteViewItem extends React.PureComponent<SiteViewItemProps> {
  render() {
    return (
      <tr>
        <td>{this.props.siteView.name}</td>
        <td>{this.props.siteView.url}</td>
        <td>
          <StyledButton>Edit</StyledButton>
          <StyledButton>Delete</StyledButton>
        </td>
      </tr>
    );
  }
}

export default SiteViewItem;
