import * as React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { SiteItemFragment } from 'types/SiteItemFragment';
import ThemedButton from 'components/StyledComponents/index';

interface SiteItemProps {
  site: SiteItemFragment;
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void;
}

const StyledButton = styled(ThemedButton)`
  margin-right: 15px;
`;

class SiteItem extends React.PureComponent<SiteItemProps> {
  static fragment = gql`
    fragment SiteItemFragment on Site {
      id
      name
      subdomain
    }
  `;

  handleEditClick = () => {
    this.props.onEdit(this.props.site.id);
  };

  handleDeleteClick = () => {
    if (!window) return;
    if (!this.props.onDelete) return;

    if (window.confirm('Are you sure?')) {
      this.props.onDelete(this.props.site.id);
    }
  };

  render() {
    return (
      <tr>
        <td>{this.props.site.name}</td>
        <td>{this.props.site.subdomain}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
          {this.props.onDelete && (
            <StyledButton onClick={this.handleDeleteClick}>Delete</StyledButton>
          )}
        </td>
      </tr>
    );
  }
}

export default SiteItem;
