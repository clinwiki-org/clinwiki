import {combineReducers} from 'redux';
import { RouterState, connectRouter } from 'connected-react-router'
import { History } from 'history';
import userReducer from 'services/user/reducer';
import siteReducer from 'services/site/reducer';
import hasuraSiteReducer from 'services/hasuraSite/reducer';
import searchReducer from 'services/search/reducer';
import studyReducer from 'services/study/reducer';
import introspectionReducer from 'services/introspection/reducer';
import crowdKeysReducer from 'services/crowdKeys/reducer';

const rootReducer = (history : History) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    site: siteReducer,
    search: searchReducer,
    study: studyReducer,
    introspection: introspectionReducer,
    hasuraSite: hasuraSiteReducer,
    crowdKeys: crowdKeysReducer
});

export default rootReducer;

export interface RootState {
    router: RouterState,
    user: any,
    site: any,
    search: any,
    study: any,
    introspection: any,
    hasuraSite: any,
    crowdKeys: any,
};

//export type RootState = ReturnType<typeof rootReducer>;
