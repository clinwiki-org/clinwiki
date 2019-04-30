import * as React from 'react';
import { gql } from 'apollo-boost';
import { SiteItemFragment } from 'types/SiteItemFragment';
import { Button } from 'react-bootstrap';

interface SiteItemProps {
  site: SiteItemFragment;
  onEdit: (id: number) => void;
}

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

  render() {
    return (
      <tr>
        <td>{this.props.site.name}</td>
        <td>{this.props.site.subdomain}</td>
        <td>
          <Button onClick={this.handleEditClick}>Edit</Button>
        </td>
      </tr>
    );
  }
}

export default SiteItem;
