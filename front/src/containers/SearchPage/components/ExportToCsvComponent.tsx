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

    return (
      <>
        <ExportToCsvButton
          siteView={props.siteView}
          searchHash={props.searchHash}
          setExportId={setExportId}
          user={user}
        />
        {exportId !== null ? (
          <ExportToCsvDialog exportId={exportId} setExportId={setExportId} />
        ) : null}
      </>
    );
}

export default ExportToCsvComponent;
