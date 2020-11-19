import * as React from 'react';
import ReactStars from 'react-stars';
import styled, { keyframes } from 'styled-components';

interface WorkFlowAnimationProps {
  resetAnimation: any;
  rankColor: any;
}

const flashKeyFrames = keyframes`
  0% {
    opacity: 0;

  }
  25%{
    opacity:0.5
  }
  50%{
    opacity: 1;

  }

  75%{
      opacity:0.75;

  }100%{
    opacity: 0;

  }

`

const coolBoxKeyframes = keyframes`
0%{
    opacity:0.5;
    right: 45%;
    top:50%;
  }
  100%{
      opacity:1;
      right:0;
      top:0;
  }

`

export const Animation = styled.div`


display: inline-block;
position:fixed;
background: transparent;
width: 30px;
opacity:0;

.force-visible{
  overflow: visible !important;
}
.force-visible span{
  overflow: visible !important;
}
animation-name: ${coolBoxKeyframes};
animation-duration: 6s;
animation-timing-function: ease;
animation-delay: 2s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`
export const FlashAnimation = styled.div`


position:fixed;
background: transparent;
width: 50px;
opacity:0;
left:50%;
top:50%;

.force-visible{
  overflow: visible !important;
}
.force-visible span{
  overflow: visible !important;
}

animation-name: ${flashKeyFrames};
animation-duration: 2.5s;
animation-timing-function: ease;
animation-delay: 0s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`

class WorkFlowAnimation extends React.Component<WorkFlowAnimationProps> {

  render() {
    this.props.resetAnimation();
    const color = this.props.rankColor;
    return (
      <span>
        <FlashAnimation>
          <ReactStars
            count={1}
            color1={color}
            color2={color}
            half={false}
            size={60}
            className={'force-visible'}
          />
        </FlashAnimation>
        <Animation>
          <ReactStars
            count={1}
            color1={color}
            color2={color}
            half={false}
            size={40}
            className={'force-visible'}

          />
        </Animation>

      </span>

    );
  }
}

export default WorkFlowAnimation;
