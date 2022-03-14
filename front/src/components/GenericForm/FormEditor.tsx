import React, { useState, useEffect } from 'react'
import { find, propEq } from 'ramda'
import { ThemedButton } from '../StyledComponents'
import ListLookUp from './ListLookUp'
import LabeledButton from 'components/LabeledButton'
const FormEditor = ({ row, fields, isInsert, onSave }) => {
  console.log('the insert', fields)
  const [formState, setFormState] = useState([])
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    let values = [];
    Object.entries(row).map(([key, value]) => {
      //@ts-ignore
      values[key] = value;
      setFormState(values);
    })
  }, [row])

  useEffect(() => {
    if (isInsert == true) {
      let values = [];
      Object.entries(row).map(([key, value]) => {
        //@ts-ignore
        values[key] = "";
        setFormState(values);
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

      setFormState({ ...values });
    }
    else {
      //some crude validation 
      setIsInvalid(false)
      console.log('CHAR0', e.target.value.charAt(e.target.value.length - 1))
      if (e.target.value.charAt(0) == "{" || e.target.value.charAt(e.target.value.length - 1) == "}") {
        let newValue = tryParseJSONObject(e.target.value)
        if (newValue == false) {
          console.log('isvalid', isInvalid)
          setIsInvalid(true)
        }
      }
      //@ts-ignore
      values[key] = e.target.value;
      setFormState({ ...values });
    }
  }

  const renderInsertForm = () => {
    return Object.entries(fields).map(([x, value]) => {
      console.log('x insert Form', x)
      //@ts-ignore
      const key = isInsert ? value.field_name : x
      if (key == "created_at" || key == "updated_at") {
        return
      }
      //@ts-ignore
      if (value.type == "Boolean") {
        return <div key={key} className="flex flex-wrap -mx-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
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
        <div key={key} className="flex flex-wrap -mx-3 mb-6">
          {isInvalid && <div className="generic-error">Bad JSON object</div>}
          <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
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
//Some rudimentary sorting
//Our fields are already sorted so use it as a basis to re-arrange obj
    let sortedRow = {};
    fields.map((field)=>{      
      let currentField = field.field_name;
      let currentValue = row[currentField]      
      sortedRow[currentField] = currentValue; 
    
    });

    console.log('the UPDATE', sortedRow)
    return Object.entries(sortedRow).map(([key, value]) => {
      console.log('x update Form', key, value)
      const currentField = find(propEq('field_name', key))(fields);
      console.log(currentField)
      switch (currentField?.field_input_type) {
        case 'Input_text':
          return (
            <div key={key} className="flex flex-wrap -mx-3 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                <div>
                  {key}
                </div>
              </label>

              <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-800 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name={key}
                onChange={(e) => handleChange(e, key)}

                value={formState[key]}
              // disabled={!!(key == "id")}
              />
            </div>

          )
        // case 'Input_text':
        //   return (
        //     <div key={key} className="flex flex-wrap -mx-3 mb-6">
        //       <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
        //         <div>
        //           {key}
        //         </div>
        //         <div>
        //           <textarea
        //             name={key}
        //             onChange={(e) => handleChange(e, key)}

        //             value={formState[key]}
        //             disabled={true}
        //           />
        //         </div>
        //       </label>
        //     </div>
        //   )
        case 'View_Date':
          return (
            <div key={key} className="flex flex-wrap -mx-3 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                <div>
                  {key}
                </div>
              </label>
              <div>
                <input
                  type="text"
                  name={key}
                  // onChange={(e) => handleChange(e, key)}

                  value={formState[key]}
                  disabled={true}
                />
              </div>
            </div>
          )
        case 'JSON_text':
          return (
            <div key={key} className="flex flex-wrap -mx-3 mb-6">
              {isInvalid && <div className="generic-error">Bad JSON object</div>}
              <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                <div>
                  {key}
                </div>
              </label>
              <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-800 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name={key}
                onChange={(e) => handleChange(e, key)}

                value={formState[key]}
              // disabled={!!(key == "id")}
              />
            </div>

          )
        case 'Boolean':
          return (
            < div key={key} className="flex flex-wrap -mx-3 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                <div>
                  {key}
                </div>
              </label>
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
            </div>

          )
        case "Dropdown":
          // console.log("DD K", key)
          // console.log(currentField["field_action_values"])
          if (currentField["field_action"] == 'List_Lookup') {
            return (<div className="flex flex-wrap -mx-3 mb-6">

              <ListLookUp label={key} action={currentField["field_action_values"]} currentValue={formState[key]} />
            </div>)
          } else {
            const field_action = JSON.parse(currentField["field_action_values"]);
            return (
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="inline-block relatrive w-64">

                  <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                    <div>
                      {key}
                    </div>
                  </label>
                  <select className="block  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    name={key} id={key}>
                    {field_action.map && field_action.map((item) => {
                      return formState[key] == item ? <option key={item} value={item} selected>{item}</option> : <option key={item} value={item}>{item}</option>
                    })}
                  </select>
                </div>
              </div>
            )
          }
        case "Button":
          return <LabeledButton helperText={currentField["field_description"]} buttonTitle={currentField["field_action"]}  ></LabeledButton>
        case "Link":
          return
        case "Hidden":
          return

        default:
          return (
            <div key={key} className="flex flex-wrap -mx-3 mb-6">
              {isInvalid && <div className="generic-error">Bad JSON object</div>}
              <label className="block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2">
                <div>
                  {key}
                </div>
              </label>
              <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-800 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name={key}
                onChange={(e) => handleChange(e, key)}

                value={formState[key]}
                disabled={!!(key == "id")}
              />
            </div>

          )
      }
    })
  }

  return (
    <form className="w-4/5 m-auto">

      <ThemedButton
        style={{ marginTop: 10, float: 'right' }}
        onClick={(e) => onSave(e, formState)}
      >Save</ThemedButton>
      {!isInsert ? renderUpdateForm() : null}
      {isInsert ? renderInsertForm() : null}
    </form>)
}

export default FormEditor


