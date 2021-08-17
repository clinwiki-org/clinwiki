import React, {useState, useEffect} from 'react'
import {ThemedButton} from '../StyledComponents'

const FormEditor = ({row, fields, isInsert, onSave}) => {
  console.log('the insert', fields)
  const [formState, setFormState] = useState([])
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    let values = [];
    Object.entries(row).map(([key, value]) => {
    //@ts-ignore
      values[key] = value;
      setFormState( values );
    })
  }, [row])

  useEffect(() => {
    if (isInsert == true) {
    let values = [];
    Object.entries(row).map(([key, value]) => {
    //@ts-ignore
      values[key] = "";
      setFormState( values );
    })
  }
  }, [isInsert])

  const tryParseJSONObject = (jsonString) => {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
  const handleChange = (e, key, type?: string) => {
  
    if (type == "checkbox") {
      let values = formState

      //@ts-ignore
      values[key] = e.target.value == "true" ? true : false;

      setFormState({...values});
    }
    else {
      // checking for JSON will go here
      // setIsInvalid(false)
      // let isJSON = e.target.value
      // let newValue = tryParseJSONObject(e.target.value)
      // if (newValue == false) {
      //   console.log('isvalid', isInvalid)
      //   setIsInvalid(true)
      // }
    let values = formState
    //@ts-ignore
    values[key] = e.target.value;
    setFormState({...values});
    }
  }

  const renderInsertForm = () => {
    return Object.entries(fields).map(([x, value]) => {
      //@ts-ignore
      const key = isInsert ? value.name : x
      if (key =="created_at" || key == "updated_at") {
        return
      }
      //@ts-ignore
      if (value.type == "Boolean") {
        return <div key={key}>
          <label>
            <div>
              {key}
            </div>
            <div>
              True
              <input
                type="radio"
                value={"true"}
                checked={formState[key] == true}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
              False
              <input
                type="radio"
                value={"false"}
                checked={formState[key] == false}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
            </div>
          </label>
        </div>
      }
      return (
        <div key={key}>
        {isInvalid && <div className="generic-error">Bad JSON object</div>}
        <label>
          <div>
            {key}
          </div>
          <div>
            <textarea 
                  name={key} 
                  onChange={(e) => handleChange(e, key)}
              
                  value={formState[key]}
                  disabled={!!(key == "id")}
                  />    
          </div>
        </label>
        </div>
      )
    })
  }

  const renderUpdateForm = () => {
    return Object.entries(row).map(([key, value]) => {
      if (key =="created_at" || key == "updated_at") {
        return
      }
      if (typeof value == "boolean") {
        return <div key={key}>
          <label>
            <div>
              {key}
            </div>
            <div>
              True
              <input
                type="radio"
                value={"true"}
                checked={formState[key] == true}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
              False
              <input
                type="radio"
                value={"false"}
                checked={formState[key] == false}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
            </div>
          </label>
        </div>
      }
      return (
        <div key={key}>
        {isInvalid && <div className="generic-error">Bad JSON object</div>}
        <label>
          <div>
            {key}
          </div>
          <div>
            <textarea 
                  name={key} 
                  onChange={(e) => handleChange(e, key)}
              
                  value={formState[key]}
                  disabled={!!(key == "id")}
                  />    
          </div>
        </label>
        </div>
      )
    })
  }



  return (
  <form>
    <ThemedButton
    style={{marginTop: 10, float: 'right'}}
    onClick={(e) => onSave(e, formState)}
    >Save</ThemedButton>
    { !isInsert ? renderUpdateForm() : null }
    { isInsert ? renderInsertForm() : null }

  
  
  </form>)
}

export default FormEditor


  {/* {Object.entries(row).map(([key, value]) => {
      console.log('Value', value)
      if (key =="created_at" || key == "updated_at") {
        return
      }
      if (typeof value == "boolean") {
        return <div key={key}>
          <label>
            <div>
              {key}
            </div>
            <div>
              True
              <input
                type="radio"
                value={"true"}
                checked={formState[key] == true}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
              False
              <input
                type="radio"
                value={"false"}
                checked={formState[key] == false}
                onChange={(e) => handleChange(e, key, "checkbox")}
              />
            </div>
          </label>
        </div>
      }
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
              
                  value={formState[key]}
                  disabled={!!(key == "id")}
                  />
                  
          </div>
        </label>
        </div>
      )
    })
  } */}