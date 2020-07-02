import React from 'react'
import styled from 'styled-components';
  
const Wrap = styled.div`

      .emoji-2 {
        width: 34px;
        text-align: center;
        line-height: 29px;
        font-size: 21px;
        font-family: "Apple Color Emoji", "Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol";
        cursor: pointer;
        border-radius: 5px;
        margin-top:5px;
        transform: scale(1);
        transition: transform 0.15s cubic-bezier(0.2, 0, 0.13, 2);
      }
    }
`
interface GithubSelectorEmojiProps {
    onSelect:any;
    shortcode:any;
  }
  
  interface GithubSelectorEmojiState {
    hover: boolean;

  }
  
  class GithubSelectorEmoji extends React.Component<GithubSelectorEmojiProps, GithubSelectorEmojiState> {
      state={
          hover:false
      }

  handleClick = () => {
    this.props.onSelect(this.props.shortcode)
  }
  toggleHover=(showBoolean)=>{
    this.setState({ hover: showBoolean})
  }
render(){
    let buttonStyle;
    if(this.state.hover==true){
        buttonStyle={backgroundColor: 'rgba(255,255,255,0.8)'}
    }
    return (
        < Wrap onMouseDown={ ()=>this.handleClick() } onMouseEnter={()=>this.toggleHover(true)} onMouseLeave={()=>this.toggleHover(false)} >
          <div style={buttonStyle} className='emoji-2'>
            { this.props.shortcode }
          </div>
        </Wrap>
      )  
}

}

export default GithubSelectorEmoji