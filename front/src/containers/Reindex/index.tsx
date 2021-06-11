import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {
    ThemedMainContainer,
    ThemedSearchContainer,
    StyledProfileLabel,
    StyledProfileForm
  } from 'components/StyledComponents';
import { ThemedButton } from '../LoginPage/StyledButton';  
import {reindexAll,reindexStudy} from '../../services/admin/actions';
import { RootState } from 'reducers';
import {isAdmin} from 'utils/auth';

const Reindex = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.current);
    let [nctid,setNctid] = useState('');
    //const user = useSelector((state: RootState) => state.user.current);

    if(!isAdmin(user)) {
        return (<div>Unauthorized</div>)
    }
    return (
        <div>
            <ThemedSearchContainer>
                <StyledProfileLabel>
                    Full reindex will pull in fresh data for all studies in AACT along with local crowdsourced data.
                    This process will run in the background and take a significant amount of time to finish. While it
                    is running, studies may have incomplete data as the new data is imported in stages.<p/>
                    <b>Warning:</b> Once started, this process can not be stopped.<p/>
                </StyledProfileLabel>
                <ThemedButton onClick={() => {
                    dispatch(reindexAll());
                }}>Start Full Reindex</ThemedButton>
            </ThemedSearchContainer>
            <ThemedSearchContainer>
                <StyledProfileLabel>Reindex a single study:</StyledProfileLabel>
                <StyledProfileForm
                name="nctid"
                placeholder="NCT ID"
                value={nctid}
                onChange={(ev) => setNctid(ev.target.value)}
                />
                <ThemedButton onClick={() => {
                    dispatch(reindexStudy(nctid));
                    setNctid('');
                }}>Reindex Study</ThemedButton>
            </ThemedSearchContainer>

        </div>
    );
};

export default Reindex;