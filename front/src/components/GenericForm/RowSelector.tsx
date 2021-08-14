
import React, {useEffect, useState, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';

const RowSelector = ({rows, selectRow}) => {
  // const genericData = useSelector((state: RootState) => state.hasuraSite.genericResponse);
  console.log('GENERIC Data', rows)
  return (
  <div className="flex-rows">
    {rows.map(row => <div className="generic-item" key={row.id} onClick={() => {selectRow(row.id)}}>{row.id}</div>)}
  </div>)
}

export default RowSelector