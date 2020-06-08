import React from 'react'
// import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';
import SlackCounterGroup from './SlackCounterGroup'

export const SlackCounter = ({ counters, user, onSelect, onAdd }) => {


const Counter = styled.div`
    display: flex;

    .add{
        cursor: pointer;
        font-family: Slack;
        opacity: 1;
        transition: opacity 0.1s ease-in-out;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: #6BA5D6;
        border: 1px solid #5786AD;
        border-radius: 5px;

    }
    .group-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: #6BA5D6;
        border: 1px solid #5786AD;
        border-radius: 5px;
    }
    .group-not-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: transparent;
        border: 1px solid #5786AD;
        border-radius: 5px;

    }
`
  const groups = _.groupBy(counters, 'emoji')


  return (
    <Counter>
      { _.map(groups, (c, emoji) => {
        const names = _.map(c, 'by')
        return (
        //   <div className={hasReacted ==true ? "group-active": "group-not-active"} key={ emoji }>
          <div className="group-active">  
            <SlackCounterGroup
              emoji={ emoji }
              count={ c.length }
              names={ names }
              active={ _.includes(names, user) }
              onSelect={ onSelect }
            />
          </div>
        )
      }) }
      <div className="add" onClick={ onAdd }>
        <SlackCounterGroup 
        emoji={ '+' }
        count={ '' }
        names={ '' }
        active={ '' }
        onSelect={ '' }
        />

      </div>
    </Counter>
  )
}

export default SlackCounter