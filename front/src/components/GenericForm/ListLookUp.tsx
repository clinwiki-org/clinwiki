
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { actionQuery } from 'services/admin/actions' 

interface Props {
  label: string;
  action: string; 
  currentValue:any;

}



export default function ListLookUp(props: Props) {
  const {label, action, currentValue} = props
  const dispatch = useDispatch();
  const actionData = useSelector((state: RootState) => state.adminReducer.actionData);

  useEffect(() => {
    dispatch(actionQuery(action, label));
}, [dispatch]);

if(!actionData){
  return <span>Loading..</span>
}
let resultData = JSON.parse(actionData[label].actionQuery)
let arrayToMap = resultData?.rows || [];
  return (            <label>
            <div>
              {label}
            </div>
                <select name={label} id={label}>
                  {arrayToMap.map(value=>{

                return value[label]==currentValue? <option key={value} value={value} selected >{value[label] }</option>:<option key={value} value={value} >{value[label] }</option>
  

                  })}
                </select>
            </label>
  )
}

