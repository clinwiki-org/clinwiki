import * as types from './types';

const initialState: types.GenericPageState = {
    isFetchingGenericPage: false,
    isInsertingPageViewLog: false,
    genericPageData: undefined,
};

const genericPageReducer = (
    state = initialState,
    action: types.GenericPageActionTypes
): types.GenericPageState => {
    switch (action.type) {
        case types.FETCH_GENERIC_PAGE_SEND:
            return {
                ...state,
                isFetchingGenericPage: true,
            };
            case types.FETCH_GENERIC_PAGE_SUCCESS:
                let tempObject = {...state.genericPageData}
                tempObject[action.name] = action.payload
                return {
                    ...state,
                    isFetchingGenericPage: false,
                    genericPageData: tempObject,
                };
                case types.FETCH_GENERIC_PAGE_ERROR:
                    return {
                        ...state,
                        isFetchingGenericPage: false,
                    };
                    
                    default:
            return { ...state };
    }
};

export default genericPageReducer;
