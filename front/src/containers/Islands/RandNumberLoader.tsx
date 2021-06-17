import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';


function RandNumberLoader() {

  const updatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const loadingPage = useSelector((state: RootState) => state.study.isFetchingStudy);
  const showLoader = updatingParams || loadingPage
  const studyData = useSelector((state: RootState) => state.study.studyPage);
  const recordsTotal = studyData?.data?.search?.recordsTotal;
  const [randNumber, setRandNumber] = useState(1234);
  const generateNumber = () => {
    setRandNumber(Math.floor(Math.random() * (100000 - 20 + 1)) + 20);
  }
  if (showLoader) {
    setInterval(generateNumber, 20)
    return (
      <>
        {randNumber}
      </>

    );
  }

  return <>{recordsTotal}</>

}
export default RandNumberLoader;
