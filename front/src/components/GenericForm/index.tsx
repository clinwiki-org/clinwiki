import React, {useEffect, useState, useMemo} from 'react'
// import { GraphqlSchemaType } from './schemaSelector2';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { fetchHasuraIntrospection } from 'services/introspection/actions';
import { fetchGeneric, updateGeneric} from 'services/hasuraSite/actions' 
import { BeatLoader } from 'react-spinners';
import RowSelector from './RowSelector';
import FormEditor from './FormEditor';
import styled from 'styled-components'
import {ThemedButton} from '../StyledComponents'
import { ToastContainer, toast } from 'react-toastify';
import {
  IntrospectionType,
  IntrospectionOutputTypeRef,
} from 'graphql';


export type SchemaType = JsonSchemaType | GraphqlSchemaType;

export interface JsonSchemaType {
  kind: 'json';
  schema: JsonSchema;
}
export interface GraphqlSchemaType {
  kind: 'graphql';
  typeName: string;
  types: readonly IntrospectionType[];
}

interface JsonSchemaItem {
  type: 'string' | 'number' | 'boolean';
  [others: string]: any;
}
interface JsonSchemaArray {
  type: 'array';
  items: JsonSchema;
}
interface JsonSchemaObject {
  type: 'object';
  properties: Record<string, JsonSchema>;
}
export type JsonSchema = JsonSchemaItem | JsonSchemaArray | JsonSchemaObject;


const StyledGrid = styled.div`
  .flex-rows {
    display: flex;
    flex-wrap: wrap;
  }

  .generic-header-row {
    display: flex;
    flex-wrap: wrap;

    select {
      height: 38px;
      min-width: 199px;
      margin: 1em;
      border: none;
    }
  }

  .generic-item {
    margin: 1em;
    border: 1px solid black;
    padding: 1em;
    min-width: 90px;
    background: white;
    border: none;
    cursor: pointer;
  }

  textarea, label {
    width: 100%;
    min-height: 200px;
}

.form-row-selector {
  cursor: pointer;
  color: #6BA5D6;
  font-weight: 400;
  position: relative;
  top: -14px;
  left: 3px;
  transition: .5s;
}

.form-row-selector:hover {
  color: navy;
  font-weight: 700;
}

.generic-error {
  color: red;
}

.global-filter {
  padding: .5em;

  input {
    min-width: 300px;
    height: 25px;
    margin-left: 1em;
    border: 1px solid black;
    border-radius: .4em;
  }

  input::placeholder { 
    color: grey;
    opacity: 1; /* Firefox */
  }
}

`
const TABLES = ['island_configs', 'sites', 'page_views', 'crowd_values', 'crowd_keys']
const GenericForm = (props) => {
  const dispatch = useDispatch();
  // const [fields, setFields] = useState([])
  const [row, setRow] = useState(0)
  const [isInsert, setIsInsert] = useState(false)
  const [shortFields, setShortFields] = useState([])
  const [activeTable, setActiveTable] = useState('island_configs')
  const [activeSchema, setActiveSchema] = useState({})
  const tableName = activeTable || props.tableName
  const [isForm, setIsForm] = useState(false)
  const [tableColumns, setTableColumns] = useState([])

  const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
  const genericData = useSelector((state: RootState) => state.hasuraSite.genericData);
  const isFetchingGeneric = useSelector((state: RootState) => state.hasuraSite.isFetchingGeneric);
  const genericSaveSuccessMessage = useSelector((state: RootState) => state.hasuraSite.genericUpdateSuccessMessage);
  const genericSaveErrorMessage = useSelector((state: RootState) => state.hasuraSite.genericUpdateErrorMessage);

  useEffect(() => {
    const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
    dispatch(fetchHasuraIntrospection(QUERY));
}, [dispatch]);


  
useEffect(() => {
  if (introspection) {
  let schema: GraphqlSchemaType = {
    kind: 'graphql',
    typeName: tableName,
    types: introspection.data.__schema.types,
  };

  ( async () => {
    const newSchema =schemaToInternal(schema);
    const cleanSchema = await cleanFields(newSchema)
    const tableColumns = await buildTableColumns(newSchema)
    setShortFields(cleanSchema)
    setTableColumns(tableColumns)
    //@ts-ignore
    setActiveSchema(newSchema)
    const genericQuery = await genericQueryString(newSchema)
    dispatch(fetchGeneric(genericQuery))
  })()  
 }
}, [introspection, activeTable])


useEffect(()=>{
  console.log('Generic D change', genericData)
  if (genericData) {
  // setRow(genericData[tableName][0])
  }
},[genericData])

useEffect(() => {
  if (genericSaveSuccessMessage) {
    toast(genericSaveSuccessMessage);
  } else if (genericSaveErrorMessage) {
    toast(genericSaveErrorMessage);
  }
}, [genericSaveSuccessMessage, genericSaveErrorMessage]);

const cleanFields = async (schema) => {
  //@ts-ignore
  const cleaned = schema.filter(field => field.name !== "id" && field.name !== "updated_at" && field.name !== "created_at") 
  return cleaned
}

const buildTableColumns = async (schema) => {
  const columns = []
  schema.map((i) => {
    const obj = {
      Header: i.name,
      accessor: i.name
    }
    //@ts-ignore
    columns.push(obj)
  })
  return columns;
}

const subPath = (trunk: string, leaf: string) => {
  if (!trunk) return leaf;
  else if (trunk[trunk.length - 1] === '#') {
    return `${trunk}${leaf}`;
  } else {
    return `${trunk}.${leaf}`;
  }
}

const jsonSchemaToInternal = (x: JsonSchema) => {
  function jsonSchemaToInternalImpl(
    path: string,
    x: JsonSchema,
    results: string[]
  ) {
    switch (x.type) {
      case 'string':
      case 'number':
      case 'boolean':
        results.push(path);
        break;
      case 'object':
        for (const k in x.properties) {
          jsonSchemaToInternalImpl(subPath(path, k), x.properties[k], results);
        }
        break;
      case 'array':
        jsonSchemaToInternalImpl(`${path}#`, x.items, results);
    }
  }
  let result: string[] = [];
  jsonSchemaToInternalImpl('', x, result);
  return result.sort();
}

const graphqlToInternal = (x: GraphqlSchemaType) => {
  function gqlFieldToInternal(
    path: string,
    root: IntrospectionOutputTypeRef,
    typeMap: Record<string, IntrospectionType>,
    result: any[],
    guard: string[]
  ) {
    if (result.length > 700 || guard.length > 5) return;
    switch (root.kind) {
      // Skip over non-nulls
      case 'NON_NULL':
        gqlFieldToInternal(path, root.ofType, typeMap, result, guard);
        break;
      case 'SCALAR':

        //@ts-ignore
        if (path.includes('.') || path.includes('#')) {
          break;
        }
        let resultObj = {
          name: path,
          type: root.name
        }
        result.push(resultObj);
        
        break;
      case 'LIST':
        gqlFieldToInternal(`${path}#`, root.ofType, typeMap, result, guard);
        break;
      case 'OBJECT':
        if (!guard.includes(root.name)) {
          guard.push(root.name);
          console.log('GUARD', guard)
          const itype = typeMap[root.name];
          gqlObjToInternal(path, itype, typeMap, result, guard);
          guard.pop();
        }
        break;
    }
  }

  const gqlObjToInternal = (
    path: string,
    root: IntrospectionType,
    typeMap: Record<string, IntrospectionType>,
    result: string[],
    guard: string[]
  ) => {
    switch (root.kind) {
      case 'INTERFACE':
      case 'OBJECT':
        for (const field of root.fields) {
          if (field.isDeprecated) continue;
          gqlFieldToInternal(
            subPath(path, field.name),
            field.type,
            typeMap,
            result,
            guard
          );
        }
        break;
      default:
        throw new Error(`Expected object type got ${root.kind}`);
    }
  }

 const typeMap: Record<string, IntrospectionType> = {};
  for (const t of x.types) typeMap[t.name] = t;
  let result: string[] = [];
  console.log('RESUTS madness', result)
  const rootType = typeMap[x.typeName];
  gqlObjToInternal('', rootType, typeMap, result, [rootType.name]);
  return result.sort();
}

function schemaToInternal(schemaType: SchemaType) {
  let kind = schemaType.kind || "json"
  switch (schemaType.kind) {
    case 'json':
      return jsonSchemaToInternal(schemaType.schema);
    case 'graphql':
      return graphqlToInternal(schemaType);
  }
}


  ///helper function to remove certain fields we don't want to edit from form.


  const genericQueryString = async (schema) => {

    if (typeof schema == "object") {
      // const fieldNames = schema.map((field => field.name))
      const fieldNames = Object.values(schema)
        .map((field) => {
    
        //@ts-ignore
        const newField = field.name
        return newField
      })

    return `
    query GenericTableQuery {
      ${tableName} {
        ${fieldNames.join('\n')}
      }
    }`
  }
  else return
  }

  const genericTableUpdateMutation = (formData) => {
    const inputFields = JSON.stringify(buildGQLInput())
    const updateFields =JSON.stringify(buildGQLUpdateFields())
     //@ts-ignore
    const fieldNames = Object.values(activeSchema).map((field => field.name))

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
    const schema = isInsert ? shortFields : activeSchema
    Object.values(schema).map((field:any) => {
      const key = field.name;
      const type = `$${field.name}`
      fieldInput[key] = type; 
    })
  return fieldInput
  }

  const buildGQLInput = () => {
    const fieldInput = {};
    const schema = isInsert ? shortFields : activeSchema
    Object.values(schema).map((field:any) => {
      const key = `$${field.name}`;
      const type = field.type
      fieldInput[key] = type;
    })
  return fieldInput
  }

  const genericTableCreateMutation = (formData) => {
    const inputFields = JSON.stringify(buildGQLInput())
    const updateFields =JSON.stringify(buildGQLUpdateFields())
     //@ts-ignore
    //@ts-ignore
    const fieldNames = Object.values(activeSchema).map((field => field.name))
    return `
    mutation GenericTableMutation(${inputFields.replace(/\"|{|}/g, "")}) {
      insert_${tableName}(objects: {${updateFields.replace(/\"|{|}/g, "")}}) {
        returning {
          ${fieldNames.join('\n')}
        }
      }
    }`
  }

 const onSaveMutation = async (e, formData) => {
   e.preventDefault()
   console.log('submitting', formData)
   if (isInsert === true) {
    const insertFields = Object.keys(formData).filter(key =>
      key !== 'created_at' && key !== "updated_at" && key !== "id").reduce((obj, key) =>
      {
          obj[key] = formData[key];
          return obj;
      }, {}
    );
    const genericMutation = genericTableCreateMutation(insertFields)
    dispatch(updateGeneric(insertFields, genericMutation))
    setIsInsert(false)
    setIsForm(false)
   } else { 
    const genericMutation = genericTableUpdateMutation(formData)
    dispatch(updateGeneric(formData, genericMutation))
    // const genericQuery = await genericQueryString(activeSchema)
    // dispatch(fetchGeneric(genericQuery))
  }
 }


  const selectRow = (rowId) => {
    setIsInsert(false)
    const row = genericData[tableName].find(x => x.id == rowId)
    setRow(row)
  }

  const handleActiveTable = (e) => {
    setIsInsert(false)
    setIsForm(false)
    setActiveTable(e.target.value)
  }

  const handleAddNewButton = () => {
    setIsInsert(true)
    setIsForm(true)
  }

  if (!introspection || isFetchingGeneric) {
    return <BeatLoader />;
}

  return (
    <StyledGrid>
      <ToastContainer />
      <div className="generic-header-row">
        <h3>Generic Form Take One - {activeTable}</h3>
        <span>
          <select value={activeTable} onChange={handleActiveTable}>
            {TABLES.map(table => <option key={table} value={table}>{table}</option>)}

          </select>
        </span>
        <ThemedButton
            onClick={handleAddNewButton}
            style={{ width: 200, marginTop: '1em' }}
        >Add New Row </ThemedButton>
      </div>
      <div>
        {isForm && <span className="form-row-selector" onClick={() => setIsForm(!isForm)}>Select Row</span> }
        {!isForm && <span className="form-row-selector" onClick={() => setIsForm(!isForm)}>Edit Form</span> }
      </div>
      {genericData && isForm ? <FormEditor row={row} fields={shortFields} isInsert={isInsert} onSave={onSaveMutation}/> : null }
      {genericData && genericData[tableName] && !isForm ? <RowSelector isLoading={isFetchingGeneric} columns={tableColumns} isForm={isForm} setIsForm={setIsForm} data={genericData[tableName]} selectRow={selectRow}/> : null }

      </StyledGrid>
  )
}


export default GenericForm