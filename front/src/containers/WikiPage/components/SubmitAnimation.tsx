import * as React from 'react';
import ReactStars from 'react-stars';
import styled, { keyframes } from 'styled-components';

interface SubmitAnimationProps {
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
    opacity:0;
    top:22%;
    right: 11%
  }
  100%{
      opacity:1;
      top:0;
      right:1%;
  }

`
export const AnimationContainer = styled.div`
width:40px;
padding-left:10px;
`
export const Animation = styled.div`


display: inline-block;
position:absolute;
background: transparent;
width: 30px;
opacity:0;

animation-name: ${coolBoxKeyframes};
animation-duration: 7s;
animation-timing-function: ease;
animation-delay: 2s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`
export const FlashAnimation = styled.div`



background: transparent;
width: 30px;
opacity:0;

animation-name: ${flashKeyFrames};
animation-duration: 2.5s;
animation-timing-function: ease;
animation-delay: 0s;
animation-iteration-count: 1;
animation-direction: normal;
animation-fill-mode: forwards;
animation-play-state: running;

`

class SubmitAnimation extends React.Component<SubmitAnimationProps> {

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
            size={30}
          />
        </FlashAnimation>
        <Animation>
          <ReactStars
            count={1}
            color1={color}
            color2={color}
            half={false}
            size={25}
          />
        </Animation>

      </span>

    );
  }
}

export default SubmitAnimation;
