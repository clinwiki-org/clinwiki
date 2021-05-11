import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { RootState } from 'reducers';
import ExportToCsvButton from './ExportToCsvButton';
import ExportToCsvDialog from './ExportToCsvDialog';

interface ExportToCsvComponentProps {
  searchHash: string;
}

interface ExportToCsvComponentState {
  exportId?: Number | null;
  setShowExportModal: boolean;
}

const ExportToCsvComponent = (props: ExportToCsvComponentProps ) => {
  const [exportId,setExportId] = useState(null);
  const user = useSelector( (state:RootState) => state.user.current);
  const [showExportModal, setShowExportModal] = useState(false);

  const searchExport = useSelector( (state: RootState) => state.search.searchExport);
  //console.log("🚀 ~ file: searchExport", searchExport);

  if(!searchExport){
    return (
      <ExportToCsvButton
      searchHash={props.searchHash}
      setExportId={setExportId}
      setShowExportModal={setShowExportModal}
      user={user}
    />
    )
  }

    return (
      <>
        <ExportToCsvButton
          searchHash={props.searchHash}
          setExportId={setExportId}
          setShowExportModal={setShowExportModal}
          user={user}
        />
        {searchExport !== undefined && showExportModal ?  (
          <ExportToCsvDialog exportId={searchExport.id} setExportId={setExportId} setShowExportModal={setShowExportModal} />
        ) : null}
      </>
    );
}

export default ExportToCsvComponent;
