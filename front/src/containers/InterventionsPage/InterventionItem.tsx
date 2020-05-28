import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { InterventionItemFragment } from 'types/InterventionItemFragment';

const TrWithPointer = styled.tr`
  cursor: pointer;
`;

const Tr = styled.tr``;

interface InterventionItemProps {
  fields: string[];
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
    this.props.onClick && this.props.onClick(this.props.interventionItem.id);
  };

  render() {
    if (!this.props.interventionItem) return null;
    const Wrapper = this.props.onClick ? TrWithPointer : Tr;
    return (
      <Wrapper onClick={this.handleClick}>
        {this.props.fields.includes('name') && (
          <td>{this.props.interventionItem.name || 'No name provided'}</td>
        )}
        {this.props.fields.includes('type') && (
          <td>{this.props.interventionItem.type || 'No type provided'}</td>
        )}
        {this.props.fields.includes('description') && (
          <td>
            {this.props.interventionItem.description ||
              'No description provided'}
          </td>
        )}
      </Wrapper>
    );
  }
}

export default InterventionItem;
