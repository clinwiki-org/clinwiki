import React, { useState, useMemo, useEffect } from 'react';
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

interface Props {
  schema: SchemaType;
  onSelectItem?: (v: string) => void;
  setFields?: any;
  setShortFields?: any;
  cleanFields?:any;
}

const menuStyle: React.CSSProperties = {
  height: '350px',
  width: '200px',
  textAlign: 'left',
  overflowY: 'scroll',
};
const linkStyle: React.CSSProperties = {
  color: 'black',
  display: 'block',
  padding: '12px',
  textDecoration: 'none',
};

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

function subPath(trunk: string, leaf: string) {
  if (!trunk) return leaf;
  else if (trunk[trunk.length - 1] === '#') {
    return `${trunk}${leaf}`;
  } else {
    return `${trunk}.${leaf}`;
  }
}

function jsonSchemaToInternal(x: JsonSchema) {
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

function graphqlToInternal(x: GraphqlSchemaType) {
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
        // console.log('PATH', (root.name))
        // if (path == "id" || path == "updated_at" || path == "created_at") {
        //  break;
        // }
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

  function gqlObjToInternal(
    path: string,
    root: IntrospectionType,
    typeMap: Record<string, IntrospectionType>,
    result: string[],
    guard: string[]
  ) {
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

function indent(count: number) {
  let result = '';
  for (let x = 0; x < count; ++x) result += ' ';
  return result;
}

function pathToTemplate(path: string): string {
  let eachCount = 0;
  let result = '';
  // Add the #each blocks
  let parts = path.split('#');
  for (let x = 0; x + 1 < parts.length; ++x) {
    let part = parts[x];
    if (part[0] === '.') part = part.slice(1);
    result += indent(eachCount);
    result += `{{#each ${part}}}\n`;
    eachCount += 1;
  }
  // Add the actual value
  const last = parts[parts.length - 1];
  result += indent(eachCount);
  result += `{{${last}}}  \n`;
  // Close the each blocks
  while (eachCount > 0) {
    eachCount -= 1;
    result += indent(eachCount);
    result += '{{/each}}\n';
  }

  return result;
}

const SchemaSelector2 = React.memo((props: Props) => {
  const [filter, setFilter] = useState('');
  const schema =schemaToInternal(props.schema);

  useEffect(()=>{
    props.setFields(schema)
    const cleanSchema = props.cleanFields(schema)
    console.log('CLEANED SCHEMA', cleanSchema)
    props.setShortFields(cleanSchema)
  },[])

  useEffect(()=>{
    (async () => {
      console.log('SCHEMA',schema)
      const cleanSchema = await props.cleanFields(schema)
      console.log('CLEANED SCHEMA',cleanSchema)
      // props.setFields(schema)
      
    })()
 
  },[schema])

  return (
    <div>
      {/* <input
        className="mailmerge-filter" style={{ width: '100%' }}
        onChange={e => setFilter(e.target.value.toLowerCase())}
        placeholder="filter..."
      />
      <div className="mailmerge-menu" style={menuStyle}>
        {schema
          .filter(i => i.toLowerCase().includes(filter))
          .map(i => (
            <a
              key={i}
              style={linkStyle}
              onClick={_ => props.onSelectItem?.(pathToTemplate(i))}>
              {' '}
              {i}{' '}
            </a> // eslint-disable-line
          ))}
      </div> */}
    </div>
  );
})

export default SchemaSelector2