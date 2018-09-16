import configureStore from 'redux-mock-store';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import {
  FETCH_TRENDING_TAGS, STORE_SELECTED_TAGS, FETCH_AND_FILTER_POSTS, fetchTrendingTags, fetchPosts,
} from '../../actions';
import { MAX_TAGS } from '../../config';
import testInput from '../fixtures/userInput';

const mockStore = configureStore([ReduxPromise, ReduxThunk]);

test(`should return ${MAX_TAGS} trending tags by default, including first tag with an empty name`, async () => {
  const store = mockStore({});
  await store.dispatch(fetchTrendingTags());
  const action = store.getActions()[0];
  expect(action.type).toBe(FETCH_TRENDING_TAGS);
  expect(action.payload instanceof Array).toBe(true);
  expect(action.payload).toHaveLength(MAX_TAGS);
  expect(action.payload[0].name).toBe('');
});

test('should return undefined when supplied tag\'s array is empty', () => {
  const { filter, checkedCategory } = testInput[0];
  const action = fetchPosts([], filter, checkedCategory);
  expect(action).toBeUndefined();
});

test('fetchPosts should dispatch storeSelectTags and fetchAndFilterPosts with correct arguments', async () => {
  const { tags, filter, checkedCategory } = testInput[0];
  const store = mockStore({});
  await store.dispatch(fetchPosts(tags, filter, checkedCategory));
  const actions = store.getActions();
  expect(actions).toHaveLength(2);
  expect(actions[0]).toEqual({
    type: STORE_SELECTED_TAGS,
    payload: {
      tags,
      checkedCategory,
    },
  });
  expect(actions[1].type).toBe(FETCH_AND_FILTER_POSTS);
  expect(actions[1].payload instanceof Array).toBe(true);
}, 10000);
