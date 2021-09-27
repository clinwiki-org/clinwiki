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
import { useHasuraFragment } from '../../MailMerge/HasuraMMFragment';
import { getStudyQuery } from '../../MailMerge/MailMergeUtils';
import { RootState } from 'reducers';
interface SlackCounterProps {
    activeReactions: any;
    user: any;
    onSelect?: any;
    onAdd: any;
    nctId: any;
    currentUserAndStudy: any;
    allReactions: any;
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
export default function SlackCounter(props: SlackCounterProps) {
    const pageViewData = useSelector((state:RootState) => state.study.pageView);
    const currentPage = pageViewData ? pageViewData?.data?.site?.pageView : null;
    const [ fragmentName, fragment ] = useHasuraFragment('Study', currentPage?.template || '');
    const studyQuery = `${getStudyQuery(fragmentName, fragment)}`
    const dispatch = useDispatch();
    const [currentUserAndStudy, setCurrentUserAndStudy] = useState([]);

    useEffect (() => {
      setCurrentUserAndStudy(props.currentUserAndStudy);
    },[props.currentUserAndStudy])

    const deleteReactionHelper = (reaction) => {
        console.log(reaction);
        const { nctId } = props
        let id = reaction.id
        nctId && dispatch (deleteReaction(id, studyQuery, props.nctId));
    }
    const createReactionHelper = (reaction) => {
        let reactionKindId = reaction.id
        const {nctId}= props

        dispatch (createReaction(nctId, reactionKindId, studyQuery));
    }
    const currentReactionFilter = (reactionName) => {
        //we dont have all the necessary data in activeReactions to interact with the db, 
        //this is where this function comes into play:

        //we take the reaction name and find it in our array with all our reactions that has all that data

        if (props.allReactions) {
            let allReactions = props.allReactions.reactionKinds
            return find(propEq('name', reactionName))(allReactions)
        }
    }
    const findUserReaction = (reaction: any | undefined, userReactions: any[]): object | undefined => {
        //much like currentReactionFilter() we don't have the necesarry data 
        //to interact with db  in the case a reaction is one a user has already interacted with before


        //in order to make sure we are passing the adequate data needed to update our db we look for it in our array userReactions where we can find everything we need
        if (reaction && userReactions) {
            return find(propEq('reactionKindId', reaction.id))(userReactions);

        }
        return
    }
    const renderReactionButtons = () => {
        let userReactionsCurrent = currentUserAndStudy;
        return (
            props.activeReactions.map((reaction, index) => {

                let currentReaction = currentReactionFilter(reaction.name)

                let isUserReaction = findUserReaction(currentReaction, userReactionsCurrent)
                if (isUserReaction && currentReaction) {
                    return (
                        <div className="group-active" key={reaction.name}>
                            <SlackCounterGroup
                                emoji={currentReaction.unicode}
                                count={reaction.count}
                                names={' '}
                                active={' '}
                                onSelect={() => deleteReactionHelper(isUserReaction)}
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
                                onSelect={() => createReactionHelper(currentReaction)}
                            />


                        </div>
                    )
                } else {
                    return
                }

            })

        )
    }
    let addEmoji = <Icon icon={smilePlus} width="1.5em" />
    let userReactionsCurrent = props.currentUserAndStudy;
    return (
        <ThemedCounter>

            {renderReactionButtons()}
            <div className="add" onClick={props.onAdd}>
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
