import React from 'react'
// import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';
import SlackCounterGroup from './SlackCounterGroup'
import { find, propEq, findLastIndex, filter } from 'ramda';
import { Icon, InlineIcon } from '@iconify/react';
import smilePlus from '@iconify/icons-fe/smile-plus';
import DeleteReactionMutation, {
} from 'mutations/DeleteReactionMutation';
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';

interface SlackCounterProps {
    activeReactions: any;
    reactions:any;
    user: any;
    onSelect?: any;
    onAdd: any;
    nctId: any;
    currentUserAndStudy: any;
    studyRefetch?: any;
    refetch?: any;
    allReactions:any;
}
interface SlackCounterState {
    showLabel: boolean;
    currentUserAndStudy: any[];
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
        cursor:pointer;
    }
    .group-not-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: transparent;
        border: 1px solid #5786AD;
        border-radius: 5px;
        cursor:pointer;
    }
`
class SlackCounter extends React.Component<SlackCounterProps, SlackCounterState> {
    state: SlackCounterState = {
        showLabel: false,
        currentUserAndStudy: []
    }


    componentDidMount() {
        this.setState({ currentUserAndStudy: this.props.currentUserAndStudy })
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ currentUserAndStudy: this.props.currentUserAndStudy })
        }
    }
    deleteReactionHelper = (deleteReaction, reaction) => {
        deleteReaction({
            variables: {
                id: reaction.id
            }
        })
            .then(() => this.props.refetch())
            .then(() => this.props.studyRefetch())
    }
    createReactionHelper = (createReaction, reaction) => {
        let reactionID = reaction.id
        createReaction({
            variables: {
                reactionKindId: reactionID,
                nctId: this.props.nctId
            }
        })
            .then(() => this.props.refetch())
            .then(() => this.props.studyRefetch())



    }
    currentReactionFilter=(reactionName)=>{
        if(this.props.allReactions.data){
            let array =this.props.allReactions.data.reactionKinds
             return find(propEq('name', reactionName))(array)
        }
    }
    isReactionUnique = (val: any |undefined, valArray: any[]): object | undefined=>{
        console.log("VAL",val)
        console.log("ARRAY",valArray)
         if (val && valArray){
         return find(propEq('reactionKindId', val.id))(valArray);
     
     }
     return
     }
    renderReactionButtons = () => {
        let userReactionsCurrent = this.state.currentUserAndStudy;
        console.log(this.props.allReactions)
        return (
            this.props.activeReactions.map((reaction, index) => {
                
                console.log("Ririr",reaction)
                let currentReaction = this.currentReactionFilter(reaction.name)
                console.log("Actual RIRIR",currentReaction)
                let isActive = this.isReactionUnique(currentReaction, userReactionsCurrent)

                if (isActive && currentReaction) {
                    return (
                        <div className="group-active" key={reaction.name}>
                            <DeleteReactionMutation>
                                {deleteReaction => (
                                    <SlackCounterGroup
                                        emoji={currentReaction.unicode}
                                        count={reaction.count}
                                        names={' '}
                                        active={' '}
                                        onSelect={() => this.deleteReactionHelper(deleteReaction, isActive)}

                                    />
                                )}
                            </DeleteReactionMutation>
                        </div>
                    )
                } else if (isActive == undefined && currentReaction) {
                    return (
                        <div className="group-not-active" key={reaction.name}>
                            <CreateReactionMutation>
                                {createReaction => (
                                    <SlackCounterGroup
                                        emoji={currentReaction.unicode}
                                        count={reaction.count}
                                        names={' '}
                                        active={' '}
                                        onSelect={() => this.createReactionHelper(createReaction, currentReaction)}
                                    />
                                )

                                }
                            </CreateReactionMutation>



                        </div>
                    )
                } else {
                    return
                }

            })

        )
    }
    render() {
        let addEmoji = <Icon icon={smilePlus} width="1.5em" />
        let userReactionsCurrent = this.state.currentUserAndStudy;
        return (
            <Counter>

                {this.renderReactionButtons()}
                <div className="add" onClick={this.props.onAdd}>
                    <SlackCounterGroup
                        emoji={addEmoji}
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