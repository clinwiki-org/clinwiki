import React from 'react'
// import reactCSS from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';

import GithubSelectorEmoji from './GithubSelectorEmoji'

export const GithubSelector = ({ reactions, onSelect }) => {
//   const styles = reactCSS({
//     'default': {
//       selector: {
//         paddingTop: '5px',
//         backgroundColor: '#fff',
//         border: '1px solid rgba(0,0,0,0.15)',
//         borderRadius: '4px',
//         boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
//         display: 'inline-block',
//       },
//       label: {
//         fontSize: '14px',
//         lineHeight: '1.5',
//         color: '#767676',
//         margin: '6px 12px',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica',
//       },
//       divider: {
//         height: '1px',
//         margin: '8px 1px 0px',
//         backgroundColor: '#e5e5e5',
//       },
//       emoji: {
//         display: 'flex',
//         margin: '0 6px',
//       },
//     },
//   })
const Selector = styled.div`
    padding: 5px;
    background-color: none;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
    display: inline-block;
    text-align:center;
    height:5.55em;
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
          return (
            <GithubSelectorEmoji
              key={ i }
              shortcode={ reaction }
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