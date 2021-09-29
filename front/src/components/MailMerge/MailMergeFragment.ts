import { useMemo, useState } from 'react';

export function schemaTokens(input: string) {
    let tokens: string[] = [];
    const yeet = (t: string) => {
        if (t !== ''){
            const parts = t.split(/\s/).filter(id => id);
            for(const each of parts ){

                tokens.push(each);
            }
        }
    };
    let current = '';
    let last = '';
    let inside = false;
    for (const ch of input) {
        if (ch === '[' && last !== '[') {
            // Begin {{
            inside = true;
            current = ch;
        } else if (last === '[' && ch !== '[') {
            // Begin inside token
            current = ch;

        } else if (ch === ']' && last !== ']' && inside) {
            inside = false;
            // Begin }}
            yeet(current);
            current = ch;
        } else {
            current += ch;
        }
        last = ch;
    }
    //hard coded to index 0 to start
    return tokens;
}

function mustacheTokens(input: string) {
    let tokens: string[] = [];
    const yeet = (t: string) => {
        if (t !== '') tokens.push(t);
    };
    let current = '';
    let last = '';
    let inside = false;
    for (const ch of input) {
        if (ch === '{' && last !== '{') {
            // Begin {{
            inside = true;
            current = ch;
        } else if (last === '{' && ch !== '{') {
            // Begin inside token
            current = ch;
        } else if (ch === '}' && last !== '}' && inside) {
            inside = false;
            // Begin }}
            yeet(current);
            current = ch;
        } else {
            current += ch;
        }
        last = ch;
    }
    return tokens;
}



type Marker = 'x';
function tokensToGraphQLOb(tags: string[]) {
    let result: Record<string, object | Marker> = {};
    let scope = result;
    let stack = [result];
    const pushScope = name => {
        const parts = name.split('.');
        stack.push(scope);
        for (const s of parts) {
            let temp = scope[s] || {};
            if (temp === 'x') temp = {};
            scope[s] = temp;
            scope = temp as any;
        }
    };
    const popScope = () => {
        scope = stack.pop() || result;
    };
    const setProperty = (name: string) => {
        const index = name.lastIndexOf('.');
        if (index > 0) {
            // multi part property
            const scopeName = name.slice(0, index);
            const propName = name.slice(index + 1);
            pushScope(scopeName);
            scope[propName] = 'x';
            popScope();
        }
        // REMOVES RECORDSTOTAL AND THIS FROM FRAGMENT
        // RECORDSTOTAL IS HARDCODED IN THE QUERY
        if (name == 'this' || name == 'recordsTotal') {
            console.log(name);
        } else {
            // single value
            scope[name] = 'x';
        }
    };
    for (const t of tags) {
        // Check for 'block helper'
        if (t.startsWith('#')) {
            // split on any whitespace, remove blanks
            const parts = t.split(/\s/).filter(id => id);
            if (parts.length > 1) {
                const name = parts[1];
                //LIST OF THINGS TO SKIP (SPECIFIC TO MM WITH # , ie. #EACH, #IF )
                if (
                    parts[0] == '#with' && parts[1] == '$schema_name' ||
                    parts[0] == '#each' && parts[1] == 'studies' ||
                    parts[0] == '#each' && parts[1] == 'diseases' ||
                    parts[0] == '#if' && parts.length > 2
                ) {
                } else if (parts[0] == '#each' && parts.length > 2) {
                    let index = parts.length - 2;
                    pushScope(parts[index]);
                } else {
                    pushScope(name);
                }
            }
        } else if (t.startsWith('/')) {
            popScope();
        }
        // Check for non-block helper. Very similar to block helper but doesn't create a scope
        else if (t.indexOf(' ') > 0) {
            const parts = t.split(/\s/).filter(id => id);
            if (parts.length > 1) {
                const name = parts[parts.length - 1];
                //Hardcoded for now, to be kept in list like commonIslands
                //Will handle cases of handlers who should  not be part of the fragment
                if (
                    parts[0] == 'querystring' ||
                    parts[0] == '$LEFT' ||
                    parts[0] == '$RIGHT' ||
                    parts[0] == '$TRUNCATE' ||
                    parts[0] == 'formatDate' ||
                    parts[0] == 'else' ||
                    parts[0] == 'runConditional'
                    ||
                    // WAS IN MM BUT NOT CERTAIN WHAT IT DOES 
                    typeof parts[0] == typeof 1
                ) {
                } else {
                    setProperty(name);
                }
            }
        } else {
            if (t == 'else' || t == 'previousStudy' || t == 'nextStudy') {
            } else {
                setProperty(t);
            }
        }
    }
    return result;
}

function jsonToFragmentBody(
    json: Record<string, object | Marker>,
    indent = ''
) {
    if (Object.keys(json).length == 0) return '';
    var result = '{\n';
    for (const key in json) {
        const value = json[key];
        result += indent;
        if (value === 'x') {
            result += key;
            result += '\n';
        } else {
            result += key;
            result += jsonToFragmentBody(
                value as Record<string, object | Marker>,
                indent + '  '
            );
        }
    }
    result += '}\n';
    return result;
}

function toFragment(name: string, className: string, body: string) {
    if (body) {
        return `fragment ${name} on ${className} ${body}`;
    } else {
        return '';
    }
}
export function islandTokens(input: string) {
    let tokens: any[] = [];
    const yeet = (t: string) => {
        //replace() to remove any line breaks \n
        if (t !== '') {
            t = t.replace(/[\r\n]+/gm, "");
            if (t.startsWith('<')) {
                const parts = t.split(/\s/).filter(id => id);
                let object = {}
                if (parts.length > 1) {
                    object['name'] = parts[0].slice(1)
                    let attributesArray = parts[1].split("=")
                    let attributes = {};
                    attributes[attributesArray[0]] = attributesArray[1] ?
                        attributesArray[1]
                            .replace(/\"/g, "")
                            .replace(/\'/g, "") : attributesArray[1]
                    object['attribs'] = attributes
                    tokens.push(object)
                } else {
                    object['name'] = parts[0].slice(1)
                    tokens.push(object)
                }

            }

        }
    };
    let current = '';
    let last = '';
    let inside = false;
    for (const ch of input) {
        if (ch === '<') {
            // Begin <
            inside = true;
            current = ch;
        } else if (ch === '>' && current[1] !== '/') {
            inside = false;
            // Begin >
            yeet(current);
            current = ch;
        } else {
            current += ch;
        }
        last = ch;
    }
    return tokens;
}
export function removeSchemaValues(template){
    var prevTemplate;
    let cleanedTemplate =  template
    do {
        prevTemplate = cleanedTemplate;
        cleanedTemplate = cleanedTemplate.replace(/\[[^\)\(]*\]/, "");
    } while (prevTemplate != cleanedTemplate);
    return cleanedTemplate
}
export function compileFragment(
    fragmentName: string,
    className: string,
    template: string
) {
    
    let cleanedTemplate = removeSchemaValues(template)
    const tokens = mustacheTokens(cleanedTemplate);

    const json = tokensToGraphQLOb(tokens);
    const fragmentBody = jsonToFragmentBody(json);
    return toFragment(fragmentName, className, fragmentBody);
}

function randomIdentifier() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
    return Array.from({ length: 12 }, randomChar).join('');
}

export function useFragment(className: string, template: string) {
    const [fragmentName, _] = useState<string>(randomIdentifier());
    return useMemo(
        () => [
            fragmentName,
            compileFragment(fragmentName, className, template),
        ],
        [fragmentName, className, template]
    );
}
