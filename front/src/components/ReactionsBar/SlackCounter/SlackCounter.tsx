import React, { useContext, useState, useEffect } from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
// import reactCSS, { hover } from 'reactcss'
import _ from 'lodash'
import styled from 'styled-components';
import SlackCounterGroup from './SlackCounterGroup'
import { find, propEq } from 'ramda';
import { Icon, InlineIcon } from '@iconify/react';
import smilePlus from '@iconify/icons-fe/smile-plus';
import { createReaction, deleteReaction} from '../../../services/study/actions';
import withTheme from 'containers/ThemeProvider/ThemeProvider';

interface SlackCounterProps {
    activeReactions: any;
    user: any;
    onSelect?: any;
    onAdd: any;
    nctId: any;
    currentUserAndStudy: any;
    allReactions: any;
    deleteReaction: any;
    createReaction: any;
}
interface SlackCounterState {
    showLabel: boolean;
    currentUserAndStudy: any[];
}
const StyledCounter = styled.div`
    display: flex;

    .add{
        cursor: pointer;
        font-family: Slack;
        opacity: 1;
        transition: opacity 0.1s ease-in-out;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: ${props => props.theme.button};
        border: 1px solid ${props => props.theme.button};
        border-radius: 5px;

    }
    .group-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: ${props => props.theme.button};
        border: 1px solid ${props => props.theme.button};
        border-radius: 5px;
        cursor:pointer;
    }
    .group-not-active{
        margin-right: 4px;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        background: transparent;
        border: 1px solid ${props => props.theme.button};
        border-radius: 5px;
        cursor:pointer;
    }
`

export const ThemedCounter = withTheme(StyledCounter);
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
    deleteReactionHelper = (reaction) => {
        console.log(reaction);
        const { nctId }= this.props
        let id = reaction.id
        /*deleteReaction({
            variables: {
                id: reaction.id
            },
            awaitRefetchQueries: true,
            refetchQueries: [{ query: QUERY, variables: { nctId } },{ query: REACTIONS_QUERY, variables: { nctId } }]
        })*/
        this.props.deleteReaction(id);

        /*const deleteReactionMutation = (id)=>{
          console.log(id);
          if(!id) return
          return this.props.deleteReaction(id)
        }*/

    }
    createReactionHelper = (reaction) => {
        let reactionKindId = reaction.id
        const {nctId}= this.props

        /*createReaction({
            variables: {
                reactionKindId: reactionID,
                nctId: this.props.nctId
            },
            awaitRefetchQueries: true,
             refetchQueries: [
                 { query: QUERY, variables: { nctId } }, { query : REACTIONS_QUERY, variables: { nctId } } 
            ]
        })*/
        
        //implement redux dispatch here
        this.props.createReaction(nctId, reactionKindId);
        /*const createReactionMutation = (nctId, reactionKindId)=>{
          if(!nctId || !reactionKindId) return
          return this.props.createReaction(nctId, reactionKindId)
        }*/
    }
    currentReactionFilter = (reactionName) => {
        //we dont have all the necessary data in activeReactions to interact with the db, 
        //this is where this function comes into play:

        //we take the reaction name and find it in our array with all our reactions that has all that data

        if (this.props.allReactions) {
            let allReactions = this.props.allReactions.reactionKinds
            return find(propEq('name', reactionName))(allReactions)
        }
    }
    findUserReaction = (reaction: any | undefined, userReactions: any[]): object | undefined => {
        //much like currentReactionFilter() we don't have the necesarry data 
        //to interact with db  in the case a reaction is one a user has already interacted with before


        //in order to make sure we are passing the adequate data needed to update our db we look for it in our array userReactions where we can find everything we need
        if (reaction && userReactions) {
            return find(propEq('reactionKindId', reaction.id))(userReactions);

        }
        return
    }
    renderReactionButtons = () => {
        let userReactionsCurrent = this.state.currentUserAndStudy;
        return (
            this.props.activeReactions.map((reaction, index) => {

                let currentReaction = this.currentReactionFilter(reaction.name)

                let isUserReaction = this.findUserReaction(currentReaction, userReactionsCurrent)
                if (isUserReaction && currentReaction) {
                    return (
                        <div className="group-active" key={reaction.name}>
                            <SlackCounterGroup
                                emoji={currentReaction.unicode}
                                count={reaction.count}
                                names={' '}
                                active={' '}
                                onSelect={() => this.deleteReactionHelper(isUserReaction)}
                            />
                        </div>
                    )
                } else if (isUserReaction == undefined && currentReaction) {
                    return (
                        <div className="group-not-active" key={reaction.name}>
                            <SlackCounterGroup
                                emoji={currentReaction.unicode}
                                count={reaction.count}
                                names={' '}
                                active={' '}
                                onSelect={() => this.createReactionHelper(currentReaction)}
                            />


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
            <ThemedCounter>

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
            </ThemedCounter>
        )
    }


}

const mapDispatchToProps = (dispatch) => ({
  createReaction: (nctId, reactionKindId) => dispatch(createReaction(nctId, reactionKindId)),
      
  deleteReaction: (id) => dispatch(deleteReaction(id))
});
export default connect(null, mapDispatchToProps) (SlackCounter);
