import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';
import TagsReducer from './reducer_tags';

const rootReducer = combineReducers({
  tags: TagsReducer
});

export function initializeStore() {
    return createStore(rootReducer,composeWithDevTools(applyMiddleware(ReduxThunk,ReduxPromise)));
};
