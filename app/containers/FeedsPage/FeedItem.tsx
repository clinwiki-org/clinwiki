import * as React from 'react';
import { Button } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import styled from 'styled-components';

import {
  FeedItemFragment,
} from 'types/FeedItemFragment';

const TrWithPointer = styled.tr`
  cursor: pointer;
  td {
    vertical-align: middle !important;
  }
`;

const Tr = styled.tr`
  td {
    vertical-align: middle !important;
  }
`;

interface FeedItemProps {
  feedItem: FeedItemFragment;
  onClick?: (id: number) => void;
  onDelete?: (id: number) => void;
}

class FeedItem extends React.PureComponent<FeedItemProps> {
  static fragment = gql`
    fragment FeedItemFragment on Feed {
      id
      name
      kind
    }
  `;

  handleDelete = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onDelete && this.props.onDelete(this.props.feedItem.id);
  }

  handleClick = () => {
    this.props.onClick && this.props.onClick(this.props.feedItem.id);
  }

  render() {
    const Wrapper = this.props.onClick ? TrWithPointer : Tr;
    return (
      <Wrapper onClick={this.handleClick}>
        <td>
          {this.props.feedItem.name}
        </td>
        <td>
          {this.props.feedItem.kind}
        </td>
        {this.props.onDelete && <td>
          <Button bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
        </td>}
      </Wrapper>
    );
  }
}

export default FeedItem;
