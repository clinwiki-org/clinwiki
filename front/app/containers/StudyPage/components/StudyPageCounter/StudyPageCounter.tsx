import * as React from 'react';
import styled from 'styled-components';

interface StudyPageCounterProps {
  counter: number;
  recordsTotal: number | Element;
}
// interface StudyPageCounterState {
// }

const StudyPageCounterWrapper = styled.div``;

// A simple counter that displays which study you're on on the study page, in the middle of the prev and next buttons
class StudyPageCounter extends React.PureComponent<StudyPageCounterProps> {
  render() {
    return (
      // There is an error complaining about PropTypes, but none of the other components have this. Weird.
      <StudyPageCounterWrapper>
        <div id="navbuttonsonstudypage">
          {this.props.counter === null ? null : 'record '}
          <b>
            {this.props.counter}
            {typeof this.props.recordsTotal === 'number' ? '/' : null}
            {this.props.recordsTotal} &nbsp;
          </b>
        </div>
      </StudyPageCounterWrapper>
    );
  }
}

export default StudyPageCounter;
