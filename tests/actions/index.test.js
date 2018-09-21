import configureStore from 'redux-mock-store';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import {
  FETCH_TRENDING_TAGS, STORE_SELECTED_TAGS, FETCH_AND_FILTER_POSTS, fetchTrendingTags, fetchPosts, lookupAuthors, LOOKUP_AUTHORS,
} from '../../actions';
import { MAX_TAGS, MAX_AUTHORS, MAX_POSTS } from '../../config';
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

test('should return authors where their regex match the search query', async () => {
  const store = mockStore({});
  await store.dispatch(lookupAuthors('alvin'));
  const action = store.getActions()[0];
  expect(action.type).toBe(LOOKUP_AUTHORS);
  expect(action.payload instanceof Array).toBe(true);
  expect(action.payload).toHaveLength(MAX_AUTHORS);
  // authors = ['alvin','alvin1','alvin2',...]
  const authors = action.payload.map(author => author.account);
  // expect the author name in the authors array to each match the regex pattern /^alvin/
  expect(authors).toEqual(expect.arrayContaining([expect.stringMatching(/^alvin/)]));
});

describe('Testing async functions related to fetching posts', () => {
  const timeout = 15000; // timeout for each async functions call to Appbase API

  // TODO: these 3 test cases can maybe be grouped with describe.each
  test('fetchPosts should fetch ALL posts related to filter if selected tags is empty', async () => {
    const {
      tags, filter, author, checkedCategory,
    } = testInput[0];
    const store = mockStore({});
    await store.dispatch(fetchPosts(tags, filter, author, checkedCategory));
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
    // unprocessed posts should return the full list of posts
    expect(actions[1].payload).toHaveLength(MAX_POSTS);
  }, timeout);

  test('fetchPosts should dispatch storeSelectTags and fetchAndFilterPosts with correct arguments (filter = trending)', async () => {
    const {
      tags, filter, author, checkedCategory,
    } = testInput[1];
    const store = mockStore({});
    await store.dispatch(fetchPosts(tags, filter, author, checkedCategory));
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
  }, timeout);

  test('fetchPosts should dispatch storeSelectTags and fetchAndFilterPosts with correct arguments (filter = author)', async () => {
    const {
      tags, filter, author, checkedCategory,
    } = testInput[2];
    const store = mockStore({});
    await store.dispatch(fetchPosts(tags, filter, author, checkedCategory));
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
  }, timeout);
});
