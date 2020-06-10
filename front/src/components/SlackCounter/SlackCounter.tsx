import React from 'react'
// import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';
import SlackCounterGroup from './SlackCounterGroup'
import { find, propEq, findLastIndex, filter } from 'ramda';



interface SlackCounterProps {
    reactions: any;
    user: any;
    onSelect: any;
    onAdd: any;
    nctId:any;
}
interface SlackCounterState {
    showLabel: boolean;
}
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
class SlackCounter extends React.Component<SlackCounterProps, SlackCounterState> {
    state: SlackCounterState = {
        showLabel: false,
    }


    hasReacted =(reaction)=>{
        switch(reaction){
            case '👍':
                const isLike = (reaction)=>{
                    return reaction == 'like'
                }
                // console.log("User Reactions", this.props.user.reactions)
                // let likeArray = filter(isLike,this.props.user.reactions)
                //  console.log("Likes :",likeArray)

                 //Need to properly filter reactions instead 
                return  find(propEq('nctId', this.props.nctId))(this.props.user.reactions);
            case '👎':
                return  find(propEq('nctId', this.props.nctId))(this.props.user.reactions);

        }
    }
    componentDidMount(){

    }
    render() {
        return (
            <Counter>
                
                {this.props.reactions.map((reaction) => {
                
                    let handleEmoji = (name) => {
                        switch (name) {
                            case 'like':
                                return '👍'
                            case 'dislike':
                                return '👎'
                            case 'heart':
                                return '❤️'
                            case 'skull_and_cross_bones':
                                return '☠️'
                        }
                    }
                    let emoji = handleEmoji(reaction.name)

                        return (
                            <div className="group-active">

                                <SlackCounterGroup
                                    emoji={emoji}
                                    count={reaction.count}
                                    names={' '}
                                    active={' '}
                                    onSelect={this.props.onSelect}
    
                                />
                            </div>
                        )
                    // }else if(this.hasReacted(emoji)==undefined) {
                    //     return (
                    //         //   <div className={hasReacted ==true ? "group-active": "group-not-active"} key={ emoji }>
                    //         <div className="group-not-active"
                    //         >

                    //             <SlackCounterGroup
                    //                 emoji={emoji}
                    //                 count={reaction.count}
                    //                 names={' '}
                    //                 active={' '}
                    //                 onSelect={this.props.onSelect}
    
                    //             />
                    //         </div>
                    //     )
                    // }else{
                    //     return
                    // }

                })}
                <div className="add" onClick={this.props.onAdd}>
                    <SlackCounterGroup
                        emoji={'+'}
                        count={''}
                        names={''}
                        active={''}
                        onSelect={''}

                    />

                </div>
            </Counter>
        )
    }


}

export default SlackCounter