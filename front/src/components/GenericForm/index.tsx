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

const GenericForm = (props) => {
  const tableName = props.tableName
  const dispatch = useDispatch();
  const [fields, setFields] = useState([])
  const [row, setRow] = useState(0)
  const [isInsert, setIsInsert] = useState(false)

  useEffect(() => {
    const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
    dispatch(fetchHasuraIntrospection(QUERY));
}, [dispatch]);


  const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
  const genericData = useSelector((state: RootState) => state.hasuraSite.genericResponse);
  
  useEffect(()=>{
    const genericQuery = genericQueryString()
    dispatch(fetchGeneric(genericQuery))
  },[fields])


  

  const genericQueryString = () => {
    return `
    query GenericTableQuery {
      ${tableName} {
        ${fields.join('\n')}
      }
    }`
  }

  const genericTableMutation = (formData) => {

    return `
    mutation GenericTableMutation($input: ${formData}) {
      update_${tableName}({id: {_eq: $${formData.id}}}) {
        ${fields.join('\n')}
      }
    }`
  }

 const onSaveMutation = (e, formData) => {
   e.preventDefault()
   console.log('submitting', formData)
   if (isInsert === true) {
     console.log('INSERT')
   } else {
    console.log('UPDATE')  
    const genericMutation = genericTableMutation(formData)
    
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

  if (!introspection) {
    return <BeatLoader />;
}

const handleAddNewButton = () => {
  setIsInsert(true)
}

const schema: GraphqlSchemaType = {
  kind: 'graphql',
  typeName: tableName,
  types: introspection.data.__schema.types,
};



console.log('ROW CHANGE', row)
  return (
    <StyledGrid>
      <h3>Generic Form Take One - Agg Island Configs</h3>
      <ThemedButton
            onClick={handleAddNewButton}
            style={{ width: 200 }}
      >Add New Row </ThemedButton>
      {genericData && row ? <FormEditor row={row} fields={fields} isInsert={isInsert} onSave={onSaveMutation}/> : null }
      {genericData ? <RowSelector rows={genericData[tableName]} selectRow={selectRow}/> : null }

      <SchemaSelector2 schema={schema} 
   
        // onSelectItem={insertSchemaItem}
        setFields={setFields}
        />
      </StyledGrid>
  )
}


export default GenericForm