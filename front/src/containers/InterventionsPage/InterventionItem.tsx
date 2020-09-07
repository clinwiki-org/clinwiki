import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { InterventionItemFragment } from 'types/InterventionItemFragment';

const TrWithPointer = styled.tr`
  cursor: pointer;
`;

const Tr = styled.tr``;

interface InterventionItemProps {
  interventionItem: InterventionItemFragment;
  onClick?: (id: number) => void;
}

class InterventionItem extends React.PureComponent<InterventionItemProps> {
  static fragment = gql`
    fragment InterventionItemFragment on Intervention {
      id
      description
      name
      type
    }
  `;

  handleClick = () => {
    const {
      onClick,
      interventionItem: { id },
    } = this.props;

    if (onClick) onClick(id);
  };

  render() {
    const { interventionItem, onClick } = this.props;
    if (!interventionItem) return null;
    const Wrapper = onClick ? TrWithPointer : Tr;
    return (
      <Wrapper onClick={this.handleClick}>
        <td>{interventionItem.name || 'No name provided'}</td>
        <td>{interventionItem.type || 'No type provided'}</td>
        <td>{interventionItem.description || 'No description provided'}</td>
      </Wrapper>
    );
  }
}

export default InterventionItem;
