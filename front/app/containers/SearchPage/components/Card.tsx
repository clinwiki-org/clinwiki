import * as React from 'react';
import { PulseLoader } from 'react-spinners';
import { inherits } from 'util';

interface CardProps {
  context : object
}

export default class Card extends React.PureComponent<CardProps> {
  render() {
    return <div>I'm a card!</div>
  }
}
