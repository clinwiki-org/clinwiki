import * as React from 'react';
import styled from 'styled-components';

interface StudyPageCounterProps {
  counter: number;
}
// interface StudyPageCounterState {
// }

const StudyPageCounterWrapper = styled.div`
`;

// A simple counter that displays which study you're on on the study page, in the middle of the prev and next buttons
class StudyPageCounter extends React.PureComponent<StudyPageCounterProps> {
  // componentWillUnmount() {
  //   // Remember state for the next mount
  //   localStorage.setItem('appState', JSON.stringify(this.props.recordsTotal));
  // }
  render() {
    return (
      // There is an error complaining about PropTypes, but none of the other components have this. Weird.
      <StudyPageCounterWrapper>
        <div id="navbuttonsonstudypage">
          record{' '}
          <b>
            {this.props.counter}/{localStorage.getItem('recordsTotal')} &nbsp;
          </b>
        </div>
      </StudyPageCounterWrapper>
    );
  }
}

export default StudyPageCounter;
