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
    let intValue = Math.floor(Number(value))
    switch (display) {
      case FieldDisplay.STAR:
        text = {
          0: '☆☆☆☆☆',
          1: '★☆☆☆☆',
          2: '★★☆☆☆',
          3: '★★★☆☆',
          4: '★★★★☆',
          5: '★★★★★',
        }[intValue];
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