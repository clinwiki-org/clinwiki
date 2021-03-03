import * as React from 'react';
import styled from 'styled-components';
import { SiteItemFragment } from 'services/site/model/SiteItemFragment';
import ThemedButton from 'components/StyledComponents/index';

interface SiteItemProps {
  site: SiteItemFragment;
  onEdit: any; // (id: number) => void;
  onDelete?: any; // (id: number) => void;
}

const StyledButton = styled(ThemedButton)`
  margin-right: 15px;
`;

class SiteItem extends React.PureComponent<SiteItemProps> {


  handleEditClick = () => {
    this.props.onEdit(this.props.site.id);
  };

  handleDeleteClick = () => {
    if (!window) return;
    //if (!this.props.onDelete) return;
    if (window.confirm('Are you sure?')) {
      this.props.onDelete(this.props.site.id);
    }
  };

  render() {
    //console.log("SITE", this.props.site)
    return (
      <tr>
        <td>{this.props.site.name}</td>
        <td>{this.props.site.subdomain}</td>
        <td>
          <StyledButton onClick={this.handleEditClick}>Edit</StyledButton>
            <StyledButton onClick={this.handleDeleteClick}>Delete</StyledButton>
        </td>
      </tr>
    );
  }
}

export default SiteItem;
