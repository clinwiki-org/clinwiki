import * as React from 'react';
import { capitalize } from 'utils/helpers';
import {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchContent,
} from 'components/StyledComponents';

interface BulkFacetCardProps {
  label: string;
  children: any;
}

class BulkFacetCard extends React.PureComponent<BulkFacetCardProps> {
  render() {
    const { label } = this.props;
    return (
      <ThemedPresearchCard>
        <ThemedPresearchHeader>
          <PresearchTitle>{capitalize(label)}</PresearchTitle>
        </ThemedPresearchHeader>
        <PresearchContent style={{ overflowY: 'auto' }}>
          {this.props.children}
        </PresearchContent>
      </ThemedPresearchCard>
    );
  }
}

export default BulkFacetCard;
