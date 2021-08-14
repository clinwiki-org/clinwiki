import React, {useState, useEffect} from 'react'
import {ThemedButton} from '../StyledComponents'

const FormEditor = ({row, fields, isInsert, onSave}) => {
  console.log('the row', row, fields[row])
  const [formState, setFormState] = useState([])

  useEffect(() => {
    let values = [];
    Object.entries(row).map(([key, value]) => {
      // const key = Object.keys(field)
      // const value = Object.values(field)
      
    // console.log('YO', e, key)
    //@ts-ignore
    values[key] = value;
    setFormState( values );
    })
  }, [row])

  useEffect(() => {
    if (isInsert == true) {
    let values = [];
    Object.entries(row).map(([key, value]) => {
      // const key = Object.keys(field)
      // const value = Object.values(field)
      
    // console.log('YO', e, key)
    //@ts-ignore
    values[key] = "";
    setFormState( values );
    })
  }
  }, [isInsert])

  const handleChange = (e, key) => {
    let values = formState
    console.log('YO', key, values)
    //@ts-ignore
    values[key] = e.target.value;
 
    setFormState(values);
  }

  console.log('form state', formState)
  return (<form>
     
    <ThemedButton
    style={{marginTop: 10, float: 'right'}}
    onClick={(e) => onSave(e, formState)}
    >Save</ThemedButton>
   
    {Object.entries(row).map(([key, value]) => {
  
      // const key = Object.keys(field)
      // const value = Object.values(field)
      console.log('KEY', key, value)
      return (
        <div key={key}>
      
        <label>
          <div>
            {key}
          </div>
          <div>
            <textarea 
                  name={key} 
                  onChange={(e) => handleChange(e, key)}
                  //@ts-ignore
                  value={formState[key]} />
                  
          </div>
        </label>
        </div>
      )
    })
  }
  
  </form>)
}

export default FormEditor