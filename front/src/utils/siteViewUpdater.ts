import { SiteViewFragment } from 'types/SiteViewFragment';
import { SiteViewMutationInput, SiteViewOperation } from 'types/globalTypes';
import { find, propEq, reject } from 'ramda';
import { cloneDeep } from 'apollo-utilities';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';

export const createMutation = (
  name: string,
  value: any
): SiteViewMutationInput => {
  const [operation, path] = name.split(':');
  const pathComponents = path.split('.');
  let finalPathComponents: any[]=[]
  pathComponents.map((path, index)=>{
    if(path=='wiki_page_edits'){
      finalPathComponents.push( `${path}.${pathComponents[index+1]}`)
    }else if(pathComponents[index-1]=='wiki_page_edits'){
      return
    }else{
      finalPathComponents.push(path)
    }
  })
  let typedOperation: SiteViewOperation;
  switch (operation.toUpperCase()) {
    case 'PUSH':
      typedOperation = SiteViewOperation.PUSH;
      break;

    case 'SET':
      typedOperation = SiteViewOperation.SET;
      break;

    case 'DELETE':
      typedOperation = SiteViewOperation.DELETE;
      break;

    default:
      typedOperation = SiteViewOperation.SET;
      break;
  }
  return {
    path: finalPathComponents,
    operation: typedOperation,
    payload: value,
  };
};

export const getViewValueByPath = (
  path: string[],
  view: SiteViewFragment | WorkflowsViewFragment
) => {
  const [key, lastView] = getLastHashByPath(path, view);
  return lastView[key];
};

export const serializeMutation = (
  mutation: SiteViewMutationInput
): SiteViewMutationInput => {
  const copy = cloneDeep(mutation);
  if (typeof copy.payload !== 'string') {
    copy.payload = JSON.stringify(copy.payload);
  }
  return copy;
};

export const updateView = <T extends SiteViewFragment | WorkflowsViewFragment>(
  view: T,
  mutations: SiteViewMutationInput[]
): T => {
  console.log('updateView');
  const result = cloneDeep(view);
  mutations.forEach(mutation => applyOne(result, mutation));
  return result;
};

const tryParse = (data, defaultValue) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {}
  }
  return defaultValue;
};

const applyOne = (
  view: SiteViewFragment | WorkflowsViewFragment,
  mutation: SiteViewMutationInput
) => {
  const [key, mutationView] = getLastHashByPath(mutation.path, view);
  if (!mutationView) return false;

  const payload = tryParse(mutation.payload, mutation.payload);

  switch (mutation.operation) {
    case SiteViewOperation.SET:
      mutationView[key] = payload;
      break;

    case SiteViewOperation.PUSH:
      mutationView[key].push(payload);
      break;

    case SiteViewOperation.DELETE:
      if (typeof mutationView[key] === 'object') {
        delete mutationView[key];
      }
      if (Array.isArray(mutationView[key])) {
        mutationView[key] = reject(
          (x: any) => x === mutation.payload || x.name === mutation.payload
        );
      }
      break;

    default:
      break;
  }
};

const getLastHashByPath = (
  components: string[],
  view: SiteViewFragment | WorkflowsViewFragment
): [string, any] => {
  let [key, ...currentComponents] = components;
  let currentView = view as any;
  while (currentComponents.length && currentView) {
    if (Array.isArray(currentView)) {
      currentView = find(propEq('name', key), currentView);
    } else if (typeof currentView === 'object') {
      currentView = currentView[key];
    } else {
      currentView = null;
    }
    key = currentComponents[0];
    currentComponents = currentComponents.slice(1);
  }

  return [key, currentView];
};
