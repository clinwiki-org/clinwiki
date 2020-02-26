import * as React from 'react';

export type SchemaType = 'json' | 'graphql';

interface Props {
  schemaType?: SchemaType;
  schema: JsonSchema;
  onSelectItem?: (v: string) => void;
}
interface State {
  filter : string
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
  // padding: "12px",
  // textDecoration: "none",
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

function jsonSchemaToInternal(x: JsonSchema) {
  function subPath(trunk: string, leaf: string) {
    if (!trunk) return leaf;
    else if (trunk[trunk.length - 1] == '#') {
      return `${trunk}${leaf}`;
    } else {
      return `${trunk}.${leaf}`;
    }
  }
  function jsonSchemaToInternalImpl(path: string, x: JsonSchema, results: string[]) {
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
  return result;
}

function graphqlToInternal(x: object) {
  return [];
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

export default class SchemaSelector extends React.Component<Props,State> {
  state = { filter: "" };
  click = (path: string) => {
    if (this.props.onSelectItem) {
      this.props.onSelectItem(pathToTemplate(path));
    }
  };
  updateFilter = (e : React.ChangeEvent<HTMLInputElement>) => {
    this.setState({filter: e.target.value.toLowerCase()});
  }
  render() {
    const schema = jsonSchemaToInternal(this.props.schema);
    return (
      <div className="mailmerge-menu" style={menuStyle}>
        <input className="mailmerge-filter" onChange={this.updateFilter} />
        {schema
        .filter(i => i.toLowerCase().includes(this.state.filter))
        .map(i => (
          <a key={i} style={linkStyle} onClick={() => this.click(i)}>
            {i}
          </a>
        ))}
      </div>
    );
  }
}
