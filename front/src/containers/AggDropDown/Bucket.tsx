import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';

interface BucketProps {
  value: string | number;
  display: FieldDisplay;
  docCount: number;
}

class Bucket extends React.Component<BucketProps> {
  render() {
    let text = '';
    const { value, display, docCount } = this.props;
    switch (display) {
      case FieldDisplay.STAR:
        text = {
          0: '☆☆☆☆☆',
          1: '★☆☆☆☆',
          2: '★★☆☆☆',
          3: '★★★☆☆',
          4: '★★★★☆',
          5: '★★★★★',
        }[value];
        break;
      case FieldDisplay.DATE:
        text = new Date(parseInt(value.toString(), 10))
          .getFullYear()
          .toString();
        break;
      default:
        text = value ? value.toString() : '';
    }
    return `${text} (${docCount})`;
  }
}

export default Bucket;
