import * as React from 'react';
import {
  StyledProfileLabel,
  StyledProfileLogValue,
} from 'components/StyledComponents';
import { UserFragment } from 'services/user/model/UserFragment';
import LabeledButton from 'components/LabeledButton';
import { deleteSavedDoc, fetchSavedDocs } from 'services/search/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';

interface userSavedDocsProps {
  //@ts-ignore
  user: UserFragment | null;
  //id?: any;
}
interface userSavedDocsState {
  isEditing: boolean;
}

export default function UserSavedDocs(props: userSavedDocsProps) {
  const userId = props.user!.id;
  
  const userSavedDocs = useSelector((state: RootState) => state.search.savedDocs);
  const dispatch = useDispatch();

  const handleDeleteSavedList = (
    id: number
  ) => () => {
    dispatch(deleteSavedDoc(id));
  };


  useEffect(() => {
    dispatch(fetchSavedDocs(userId));
  }, [dispatch]);

  // console.log("🚀 ~ userSavedDocs ~ userSavedDocs", userSavedDocs);


  if (!userSavedDocs || !userSavedDocs.data) {
    return <BeatLoader />
  }

  const savedDocs = userSavedDocs.data.saved_documents; 
  // console.log('saved seraches', savedDocs)
  return (
    (savedDocs && savedDocs?.length !== 0) ?
      <>{
        savedDocs.map((list) => (
          <StyledProfileLogValue key={list?.id}>
            <a href={list.url}> {list?.name_label} </a>: {list?.document_id}
            <div style={{ float: 'right', margin: "1px 2px" }} >
              <LabeledButton
                helperText={"Delete Study"}
                theClick={handleDeleteSavedList(list?.id)}
                iconName={"trash"}
              />
              <a href={list?.url}>
              <LabeledButton
                helperText={"Navigate to Link"}
                iconName={"link"}
              />
              </a>
            </div>
          </StyledProfileLogValue>
        ))
      }
      </>
      :
      <StyledProfileLabel>
        No Saved Documents for user {props.user?.email}
      </StyledProfileLabel>

  );
}

