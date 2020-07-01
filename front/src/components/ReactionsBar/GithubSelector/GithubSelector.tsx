import React from 'react'
import _ from 'lodash'
import styled from 'styled-components';

import GithubSelectorEmoji from './GithubSelectorEmoji'

export const GithubSelector = ({ reactions, onSelect }) => {

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
  return (
    <Selector>
      <p>Add your reaction</p>
      <div className="divider"  />
      <div className="emoji">
        { _.map(reactions, (reaction, i) => {
          console.log("Ope",reaction)
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

GithubSelector.defaultProps = {
  reactions: ['👍', '👎', '😄', '🎉', '😕', '❤️'],
}

export default GithubSelector