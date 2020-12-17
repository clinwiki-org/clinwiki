import {combineReducers} from 'redux';
import { RouterState, connectRouter } from 'connected-react-router'
import { History } from 'history';
import userReducer from 'services/user/reducer';
import siteReducer from 'services/site/reducer';

const rootReducer = (history : History) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    site: siteReducer
});

export default rootReducer;

export interface RootState {
    router: RouterState,
    user: any,
    site: any
};

//export type RootState = ReturnType<typeof rootReducer>;
