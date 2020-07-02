import React, {useEffect} from 'react'
import _ from 'lodash'
import styled from 'styled-components';

import GithubSelectorEmoji from './GithubSelectorEmoji'

export const useWindowEvent = (event, callback) => {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};

export const useGlobalMouseUp = (callback) => {
  return useWindowEvent("mouseup", callback);
};


export const GithubSelector = ({ reactions, onSelect, closeSelector }) => {

const Selector = styled.div`
padding: 5px;
    background-color: none;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
    text-align: center;
    position: absolute;
    height: 5.55em;
    z-index: 500000000000000000;
    background: rgba(0,0,0,0.45);
    right: 4.5%;
    top: 6em;
        p{
            color: white;
        }
        .divider{
            height: 1px;
            margin: 8px 1px 0px;
            background-color: #e5e5e5;
        }
        .emoji{
            display: flex;
            margin: 0 6px;
            cursor:pointer;
        }

`
useGlobalMouseUp(e => closeSelector());
  return (
    <Selector>
      <p>Add your reaction</p>
      <div className="divider"  />
      <div className="emoji">
        { _.map(reactions, (reaction, i) => {
          return (
            <GithubSelectorEmoji
              key={ i }
              shortcode={ reaction.unicode }
              onSelect={ onSelect }
            />
          )
        }) }
      </div>
    </Selector>
  )
}
export default GithubSelector