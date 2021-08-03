import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {
    ThemedMainContainer,
    ThemedSearchContainer,
    StyledProfileLabel,
    StyledProfileForm
  } from 'components/StyledComponents';
import { ThemedButton } from '../LoginPage/StyledButton';  
import {reindexAll,reindexStudy, reindexDocument, reindexAllDocuments} from '../../services/admin/actions';
import { RootState } from 'reducers';
import {isAdmin} from 'utils/auth';
import { MenuItem, DropdownButton } from 'react-bootstrap';


const Reindex = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.current);
    let [nctid,setNctid] = useState('');
    let [primaryKey,setPrimaryKey] = useState('');
    let [primaryKeyList,setPrimaryKeyList] = useState('');
    let [query,setQuery] = useState('');
    let [indexName, setIndexName] = useState('');
    let [currentIndex, setCurrentIndex] = useState('');
    //const user = useSelector((state: RootState) => state.user.current);
    const indexArray = ["STUDY", "CONDITION"]

const handleReindexAll = (indexKind)=>{

    //indeces should come from .env ideally
    if(indexKind == "STUDY"){
        window.location.hostname.includes('localhost') ? 
        dispatch(reindexAllDocuments(
            'nct_id',
            'studies_development'
        )): 
        dispatch(reindexAllDocuments(
            'nct_id',
            'studies_production'
        ));
    }
    if(indexKind == "CONDITION"){
        window.location.hostname.includes('localhost') ? 
        dispatch(reindexAllDocuments(
            'condition_id',
            'dis_development'
        )):
        dispatch(reindexAllDocuments(
            'condition_id',
            'dis_production'
        ));
    }
}
    if(!isAdmin(user)) {
        return (<div>Unauthorized</div>)
    }
    return (
        <div>
            <h1>Clinwiki Indexing</h1>
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
                    // setNctid();
                }}>Reindex Study</ThemedButton>
            </ThemedSearchContainer>
            <h1>Generic Document Indexing</h1>
            <ThemedSearchContainer>
                <StyledProfileLabel>Reindex a single document:</StyledProfileLabel>
                <StyledProfileForm
                name="primaryKey"
                placeholder="Primary Key"
                value={primaryKey}
                onChange={(ev) => setPrimaryKey(ev.target.value)}
                />
                <StyledProfileForm
                name="primaryKeyList"
                placeholder="Primary Key List"
                value={primaryKeyList}
                onChange={(ev) => setPrimaryKeyList(ev.target.value)}
                />
                {/* <StyledProfileForm
                name="gqlQuery"
                placeholder="Query"
                value={query}
                onChange={(ev) => setQuery(ev.target.value)}
                /> */}
                <StyledProfileForm
                name="indexName"
                placeholder="Index Name"
                value={indexName}
                onChange={(ev) => setIndexName(ev.target.value)}
                />


                <ThemedButton onClick={() => {
                    dispatch(reindexDocument(
                        primaryKey,
                        primaryKeyList,
                        // query,
                        indexName
                    ));
                    // setNctid();
                }}>Reindex Study</ThemedButton>
            </ThemedSearchContainer>


            <ThemedSearchContainer>
                <StyledProfileLabel>
                    Full reindex will pull in fresh data for all studies in AACT along with local crowdsourced data.
                    This process will run in the background and take a significant amount of time to finish. While it
                    is running, studies may have incomplete data as the new data is imported in stages.<p/>
                    <b>Warning:</b> Once started, this process can not be stopped.<p/>
                </StyledProfileLabel>
                <DropdownButton
            bsStyle="default"
            title={currentIndex == '' ? "Select Index": `${currentIndex}` }
            key="default"
            id="dropdown-basic-default"
            style={{
              width: '200px',
            }}>
            {indexArray.map((field, index) => {
              let sorts = [{ id: field, desc: false }];
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => setCurrentIndex(field)}>
                  {field}
                </MenuItem>
              );
            })}
          </DropdownButton>
                <ThemedButton onClick={() => {
                    handleReindexAll(currentIndex)
                }}>Start Full Reindex</ThemedButton>
            </ThemedSearchContainer>

        </div>
    );
};

export default Reindex;