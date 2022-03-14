
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { actionQuery } from 'services/admin/actions'

interface Props {
  label: string;
  action: string;
  currentValue: any;

}



export default function ListLookUp(props: Props) {
  const { label, action, currentValue } = props
  const dispatch = useDispatch();
  const actionData = useSelector((state: RootState) => state.adminReducer.actionData);

  useEffect(() => {
    dispatch(actionQuery(action, label));
  }, [dispatch]);

  if (!actionData) {
    return <span>Loading..</span>
  }
  let resultData = JSON.parse(actionData[label].actionQuery)
  let arrayToMap = resultData?.rows || [];
  return (
    <div className="inline-block relatrive w-64">
      <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">

        <div>
          {label}
        </div>
      </label>
      <select className="block  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        name={label} id={label}>
        {arrayToMap.map(value => {
          return value[label] == currentValue ? <option key={value} value={value} selected >{value[label]}</option> : <option key={value} value={value} >{value[label]}</option>
        })}
      </select>

    </div>
  )
}

