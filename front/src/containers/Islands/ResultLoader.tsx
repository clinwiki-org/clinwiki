import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import { BeatLoader, FadeLoader } from 'react-spinners';
import styled from 'styled-components';


function ResultLoader() {
  const theme = useTheme();

  const Loader = styled.div`
    min-width: 100%;
    min-height: 100%;
    background: rgb(0 0 0 / 12%);
    position: absolute;
    top: 0;
    left: 0;
    display:flex;

`
  const LoaderPanel = styled.div`
    display:flex;
    margin:auto;

`

  const updatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const loadingPage = useSelector((state: RootState) => state.study.isFetchingStudy);

  if (updatingParams !== false || loadingPage !== false) {

    return (

      <Loader>
        <LoaderPanel>

          <FadeLoader />
        </LoaderPanel>
      </Loader>

    );
  }
  return null
}
export default ResultLoader;