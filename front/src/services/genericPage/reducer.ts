import * as types from './types';

const initialState: types.GenericPageState = {
  metaFields: {},
  isInsertingPageViewLog: false
};

const genericPageReducer = (
    state = initialState,
    action: types.GenericPageActionTypes
): types.GenericPageState => {
    switch (action.type) {
        case types.FETCH_META_FIELDS_SUCCESS:
            return {
                ...state,
                metaFields: action.payload
            };
  
        default:
            return { ...state };
    }
};

export default genericPageReducer;
