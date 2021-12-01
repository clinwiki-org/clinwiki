import React, {useState, useEffect} from 'react'
import { find, propEq } from 'ramda'
import {ThemedButton} from '../StyledComponents'
import ListLookUp from './ListLookUp'
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
    let values = formState
    if (type == "checkbox") {


      //@ts-ignore
      values[key] = e.target.value == "true" ? true : false;

      setFormState({...values});
    }
    else {
      //some crude validation 
      setIsInvalid(false)
      console.log('CHAR0', e.target.value.charAt(e.target.value.length-1))
      if (e.target.value.charAt(0) == "{" || e.target.value.charAt(e.target.value.length-1) == "}") {
        let newValue = tryParseJSONObject(e.target.value)
        if (newValue == false) {
          console.log('isvalid', isInvalid)
          setIsInvalid(true)
        }
      }
      //@ts-ignore
      values[key] = e.target.value;
      setFormState({...values});
    }
  }

  const renderInsertForm = () => {
    return Object.entries(fields).map(([x, value]) => {
      console.log('x insert Form', x)
      //@ts-ignore
      const key = isInsert ? value.field_name : x
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
      console.log('x update Form', key, value)
      const currentField = find(propEq('field_name', key))(fields);
      console.log(currentField)
      switch (currentField?.field_input_type) {
        case 'Input_text':
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
                  // disabled={!!(key == "id")}
                  />
                </div>
              </label>
            </div>
          )
        case 'Input_text':
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
                    disabled={true}
                  />
                </div>
              </label>
            </div>
          )
        case 'View_Date':
          return (
            <div key={key}>
              <label>
                <div>
                  {key}
                </div>
                <div>
                  <input
                    type="text"
                    name={key}
                    // onChange={(e) => handleChange(e, key)}

                    value={formState[key]}
                    disabled={true}
                  />
                </div>
              </label>
            </div>
          )
        case 'JSON_text':
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
                  // disabled={!!(key == "id")}
                  />
                </div>
              </label>
            </div>
          )
        case 'Boolean':
          return (
            <div key={key}>
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
          )
        case "Dropdown":
          // console.log("DD K", key)
          // console.log(currentField["field_action_values"])
          if (currentField["field_action"] == 'List_Lookup') {
            return <ListLookUp label={key} action={currentField["field_action_values"]} currentValue={formState[key]} />
          } else {
            const field_action = JSON.parse(currentField["field_action_values"]);
            return (
              <label>
                <div>
                  {key}
                </div>
                <select name={key} id={key}>
                  {field_action.map && field_action.map((item) => {
                    return formState[key] == item ? <option key={item} value={item} selected>{item}</option> : <option key={item} value={item}>{item}</option>
                  })}
                </select>
              </label>
            )
          }
        case "Button":
          return
        case "Link":
          return
        case "Hidden":
          return

        default:
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
      }
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


  