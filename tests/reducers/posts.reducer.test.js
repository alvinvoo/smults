import configureStore from 'redux-mock-store';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import {
  get, uniq, uniqWith, keysIn, isEqual, findIndex,
} from 'lodash';
import postsReducer, { initialState } from '../../reducers/posts.reducer';
import { fetchPosts } from '../../actions';
import testInput from '../fixtures/userInput';
import { POSTFIELDS } from '../../config';

const mockStore = configureStore([ReduxPromise, ReduxThunk]);
const { tags, filter, checkedCategory } = testInput[2];
let actions = [];
let state0 = {};
let state1 = {};

beforeAll(async () => {
  // it is better to run mock store once and pass the actions separately, much cleaner IMO
  const store = mockStore({});
  await store.dispatch(fetchPosts(tags, filter, checkedCategory));
  actions = store.getActions();
  state0 = postsReducer(initialState, actions[0]);
  state1 = postsReducer(state0, actions[1]);
}, 10000);

test('should set default state', () => {
  const state = postsReducer(undefined, { type: '@@INIT' });
  expect(state).toBe(initialState);
});

test('should store selected tags and checkedCategory', () => {
  expect(state0.selectedTags).toEqual(tags);
  expect(state0.firstTagIsCategory).toEqual(checkedCategory);
});

test('should return a filtered (subset) posts list', () => {
  const origPosts = actions[1].payload;
  const origPostsIds = origPosts.map(post => (get(post, 'id')));
  const filteredPostsIds = state1.posts.map(post => (get(post, 'id')));
  expect(state1.posts.length).toBeLessThanOrEqual(origPosts.length);
  // test that the filtered posts are part of the original fetched posts
  expect(origPostsIds).toEqual(expect.arrayContaining(filteredPostsIds));
});

test('should return filtered (subset) posts with category as selected first tag', () => {
  const postsWOCat = state1.posts;
  actions[0].payload.checkedCategory = true;
  const state2 = postsReducer(initialState, actions[0]);
  const state3 = postsReducer(state2, actions[1]);
  const postsWCat = state3.posts;
  expect(postsWCat.length).toBeLessThanOrEqual(postsWOCat.length);
  const firstTags = postsWCat.map(post => post.tags[0]);
  const firstTag = uniq(firstTags);
  expect(firstTag).toHaveLength(1);
  expect(firstTag[0]).toBe(tags[0]);
});

test('should return filtered (subset) posts with all the necessary fields', () => {
  const keysInPosts = state1.posts.map(post => keysIn(post));
  const uniqKeys = uniqWith(keysInPosts, isEqual);
  const allFields = [...POSTFIELDS, 'image', 'tags', 'body', 'created'];
  expect(uniqKeys).toHaveLength(1);
  expect(uniqKeys[0]).toEqual(allFields);
});

test('should not return post without the tag field in json_metadata', () => {
  // get one of the post-processed state1's post id
  // empty out the tags of the this particular post in the payload
  // run through the reducer
  // check that now the post-processed posts list doesn't contain this post id
  const targetId = state1.posts[0].id;
  const targetIndex = findIndex(actions[1].payload, { id: targetId });
  actions[1].payload[targetIndex].json_metadata = '{}';
  const state2 = postsReducer(state1, actions[1]);
  expect(state2.posts.length).toBe(state1.posts.length - 1);
  const filteredPostsIds = state2.posts.map(post => (get(post, 'id')));
  expect(filteredPostsIds).not.toContain(actions[1].payload[targetIndex].id);
});
