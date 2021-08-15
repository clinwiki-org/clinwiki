import React, {useEffect, useState, useMemo} from 'react'
import SchemaSelector2, { SchemaType }  from './schemaSelector2'
import { GraphqlSchemaType } from './schemaSelector2';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { fetchHasuraIntrospection, fetchIntrospection } from 'services/introspection/actions';
import { fetchGeneric, updateGeneric} from 'services/hasuraSite/actions' 
import { BeatLoader } from 'react-spinners';
import RowSelector from './RowSelector';
import FormEditor from './FormEditor';
import styled from 'styled-components'
import {ThemedButton} from '../StyledComponents'
import { FieldsOnCorrectTypeRule } from 'graphql';


const StyledGrid = styled.div`
  .flex-rows {
    display: flex;
    flex-wrap: wrap;
  }

  .generic-item {
    margin: 1em;
    border: 1px solid black;
    padding: 1em;
    min-width: 90px;
    background: white;
    border: none;
  }

  textarea, label {
    width: 100%;
    min-height: 200px;
  }
`
const TABLES = ['island_configs', 'sites', 'page_views', 'crowd_keys']
const GenericForm = (props) => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState([])
  const [row, setRow] = useState(0)
  const [isInsert, setIsInsert] = useState(false)
  const [shortFields, setShortFields] = useState([])
  const [activeTable, setActiveTable] = useState('island_configs')
  const tableName = activeTable || props.tableName

  useEffect(() => {
    const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
    dispatch(fetchHasuraIntrospection(QUERY));
}, [dispatch]);


  const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
  const genericData = useSelector((state: RootState) => state.hasuraSite.genericData);
  
  useEffect(()=>{
    console.log('generic query running')
    const genericQuery = genericQueryString()
    dispatch(fetchGeneric(genericQuery))
  },[dispatch, fields])

    
  useEffect(()=>{
    if (genericData) {
    setRow(genericData[tableName][0])
    }
  },[genericData])
 

  console.log('FIELDS', fields)


  ///helper function to remove certain fields we don't want to edit from form.
  const cleanFields = async (schema) => {
    //@ts-ignore
    const cleaned = schema.filter(field => field.name !== "id" && field.name !== "updated_at" && field.name !== "created_at") 
    console.log('cleaned', cleaned)
    return cleaned
  }

  const genericQueryString = () => {

    //@ts-ignore
    const fieldNames = fields.map((field => field.name))
    return `
    query GenericTableQuery {
      ${tableName} {
        ${fieldNames.join('\n')}
      }
    }`
  }

  const genericTableUpdateMutation = (formData) => {
    const inputFields = JSON.stringify(buildGQLInput())
    const updateFields =JSON.stringify(buildGQLUpdateFields())
     //@ts-ignore
    const fieldNames = fields.map((field => field.name))
    return `
    mutation GenericTableMutation(${inputFields.replace(/\"|{|}/g, "")}) {
      update_${tableName}(where: {id: {_eq: $id}}, _set: {${updateFields.replace(/\"|{|}/g, "")}}) {
        returning {
          ${fieldNames.join('\n')}
        }
      }
    }`
  }

  const buildGQLUpdateFields = () => {
    const fieldInput = {};
    const shortFieldsArray = cleanFields(fields)
    fields.map((field:any) => {
      const key = field.name;
      const type = `$${field.name}`
      fieldInput[key] = type; 
    })
    console.log('UPDATE FIELDS', fieldInput)
  return fieldInput
  }

  const buildGQLInput = () => {
    const fieldInput = {};
    fields.map((field:any) => {
      const key = `$${field.name}`;
      const type = field.type
      fieldInput[key] = type;
    })
    console.log('INPUT', fieldInput)
  return fieldInput
  }

  const genericTableCreateMutation = (formData) => {

    return `
    mutation GenericTableMutation($input: input!}) {
      insert_${tableName}(objects: [$input]) {
        return {
          ${fields.join('\n')}
        }
      }
    }`
  }

 const onSaveMutation = (e, formData) => {
   e.preventDefault()
   console.log('submitting', formData)
   if (isInsert === true) {
    const genericMutation = genericTableCreateMutation(formData)
    dispatch(updateGeneric(formData, genericMutation))
   } else {
    console.log('UPDATE')  
    const genericMutation = genericTableUpdateMutation(formData)
    dispatch(updateGeneric(formData, genericMutation))
  }
 }


  const selectRow = (rowId) => {
    setIsInsert(false)
    console.log('select row', rowId, genericData)
    const row = genericData[tableName].find(x => x.id == rowId)
    console.log('new row', row)
    setRow(row)
  }

  const handleActiveTable = (e) => {
    setActiveTable(e.target.value)
  }

  if (!introspection) {
    return <BeatLoader />;
}

const handleAddNewButton = () => {
  setIsInsert(true)
}

console.log('INTOSPEC', introspection.data)
const schema: GraphqlSchemaType = {
  kind: 'graphql',
  typeName: tableName,
  types: introspection.data.__schema.types,
};


  return (
    <StyledGrid>
      <div>
        <h3>Generic Form Take One - Agg Island Configs</h3>
        <span>
          <select value={activeTable} onChange={handleActiveTable}>
            {TABLES.map(table => <option key={table} value={table}>{table}</option>)}

          </select>
        </span>
      </div>
      <ThemedButton
            onClick={handleAddNewButton}
            style={{ width: 200 }}
      >Add New Row </ThemedButton>
      {genericData && row ? <FormEditor row={row} fields={shortFields} isInsert={isInsert} onSave={onSaveMutation}/> : null }
      {genericData ? <RowSelector rows={genericData[tableName]} selectRow={selectRow}/> : null }

      {fields && shortFields ? 
      <SchemaSelector2 schema={schema} 
   
        // onSelectItem={insertSchemaItem}
        setFields={setFields}
        setShortFields ={setShortFields}
        cleanFields ={cleanFields}
        /> : null }
      </StyledGrid>
  )
}


export default GenericForm