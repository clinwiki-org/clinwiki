import { fromJS } from 'immutable';
import {
  SESSION_CHECKED,
} from 'containers/App/constants';

const initialState = fromJS({
  user: {
    default_query_string: null,
    email: null,
    first_name: null,
    id: null,
    last_name: null,
    loggedIn: false,
  },
});

function AppReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_CHECKED:
      return state.set('user', fromJS(action.data));
    default:
      return state;
  }
}

export default AppReducer;
