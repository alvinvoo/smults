import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';
import TagsReducer from './tags.reducer';
import PostsReducer from './posts.reducer';

const rootReducer = combineReducers({
  tags: TagsReducer,
  posts: PostsReducer,
});

export default function initializeStore() {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk, ReduxPromise)));
}
