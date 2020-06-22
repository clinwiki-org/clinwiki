import React from 'react'
import styled from 'styled-components';

// import reactCSS, { hover } from 'reactcss'
// import { listOfNames } from '../../helpers/strings'
const StyledGroup = styled.div`
    height: 25px;
    padding-top: 3px;
    padding-left:  11px;
    padding-right: 8px;
    padding-bottom: 3px;
    ;
    font-size: 11px;
    color: white;
    font-weight: 500;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
        
        .emoji{
        font-size: 16px;
        margin-top: 1px;
        padding-right: 3px;
        }
        .tooltip{
        max-width: 250px;
        word-break: break-word;
        word-wrap: normal;
        white-space: nowrap;
        font: normal normal 11px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI",
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        color: #fff;
        background: rgba(0,0,0,0.8);
        border-radius: 3px;
        padding: 5px 8px;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 4px;

        opacity: 0;
        transition: opacity 0.1s ease-in-out;
        }
`
export const SlackCounterGroup = ({ onSelect, emoji, count, names, active }) => {

  const handleClick = () => {
    onSelect && onSelect(emoji)
  }
  console.log("Group EMoji", emoji)
  
  return (
    <StyledGroup onClick={handleClick}>
      <span className='emoji'>{emoji}</span> {count}
    </StyledGroup>
  )
}

export default SlackCounterGroup