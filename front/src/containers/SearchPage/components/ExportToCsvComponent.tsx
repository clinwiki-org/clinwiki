import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { RootState } from 'reducers';
import ExportToCsvButton from './ExportToCsvButton';
import ExportToCsvDialog from './ExportToCsvDialog';


interface ExportToCsvComponentProps {
  siteView: any;
  searchHash: string;
}

interface ExportToCsvComponentState {
  exportId?: Number | null;
}

const ExportToCsvComponent = (props: ExportToCsvComponentProps ) => {
  const [exportId,setExportId] = useState(null);
  const user = useSelector( (state:RootState) => state.user.current);

  const searchExport = useSelector( (state: RootState) => state.search.searchExport);
 
  console.log("🚀 ~ file: searchExport", searchExport);
  
  
  //console.log("🚀 ~ Parent state~ exportId", exportId);

  if(!searchExport){
    return (
      <ExportToCsvButton
      siteView={props.siteView}
      searchHash={props.searchHash}
      setExportId={setExportId}
      user={user}
    />
    )
  }

    return (
      <>
        <ExportToCsvButton
          siteView={props.siteView}
          searchHash={props.searchHash}
          setExportId={setExportId}
          user={user}
        />
        {searchExport !== undefined ? (
          <ExportToCsvDialog exportId={searchExport.id} setExportId={setExportId} />
        ) : null}
      </>
    );
}

export default ExportToCsvComponent;
