import {
  get, uniq, uniqWith, keysIn, isEqual, findIndex,
} from 'lodash';
import postsReducer, { initialState } from '../../reducers/posts.reducer';
import {
  STORE_SELECTED_TAGS, FETCH_AND_FILTER_POSTS, STORED_TAGS, FETCHED_POSTS,
} from '../../actions';
import testInput from '../fixtures/userInput';
import { normalFiltersPosts, authorFilterPosts } from '../fixtures/postsInputList';
import { POSTFIELDS } from '../../config';

/**
 * PostsReducer test cases are too fragile to mock async function API call.
 * So, I mock test data for posts input instead.
 * The API calls have been tested in the actions/index test cases
 */

describe('Testing with generic filter', () => {
  const {
    tags, checkedCategory,
  } = testInput[1];
  const actions = [];
  let state0 = {};
  let state1 = {};

  beforeAll(() => {
  // it is better to run the reducers once and pass the actions separately, much cleaner IMO
    actions[0] = {
      type: STORE_SELECTED_TAGS,
      payload: {
        tags,
        checkedCategory,
      },
    };

    state0 = postsReducer(initialState, actions[0]);

    actions[1] = {
      type: FETCH_AND_FILTER_POSTS,
      payload: normalFiltersPosts,
    };

    state1 = postsReducer(state0, actions[1]);
  });

  test('should set default state', () => {
    const state = postsReducer(undefined, { type: '@@INIT' });
    expect(state).toBe(initialState);
  });

  test('should store selected tags and checkedCategory', () => {
    expect(state0.selectedTags).toEqual(tags);
    expect(state0.firstTagIsCategory).toBe(checkedCategory);
  });

  test('should have respective reducerStates for (after) storing dispatch and filtering posts dispatch', () => {
    expect(state0.reducerState).toBe(STORED_TAGS);
    expect(state1.reducerState).toBe(FETCHED_POSTS);
  });

  test('should return a filtered (subset) posts list', () => {
    const origPostsIds = normalFiltersPosts.map(post => (get(post, 'id')));
    const filteredPostsIds = state1.posts.map(post => (get(post, 'id')));
    expect(state1.posts.length).toBeLessThanOrEqual(normalFiltersPosts.length);
    // test that the filtered posts are part of the original fetched posts
    expect(origPostsIds).toEqual(expect.arrayContaining(filteredPostsIds));
  });

  test('should return filtered (subset) posts with category as selected first tag', () => {
    // state1 is post processed
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
    actions[1].payload[targetIndex].json_metadata = '{}';// caution: quick and dirty way to change data, means if rearrange this test case will fail
    const state2 = postsReducer(state1, actions[1]);
    expect(state2.posts.length).toBe(state1.posts.length - 1);
    const filteredPostsIds = state2.posts.map(post => (get(post, 'id')));
    expect(filteredPostsIds).not.toContain(actions[1].payload[targetIndex].id);
  });
});

describe('Testing with \'author\' filter', () => {
  const {
    tags, checkedCategory,
  } = testInput[2];
  const actions = [];
  let state0 = {};
  let state1 = {};

  beforeAll(() => {
    // it is better to run reducer once and pass the actions separately, much cleaner IMO
    actions[0] = {
      type: STORE_SELECTED_TAGS,
      payload: {
        tags,
        checkedCategory,
      },
    };

    state0 = postsReducer(initialState, actions[0]);

    actions[1] = {
      type: FETCH_AND_FILTER_POSTS,
      payload: authorFilterPosts,
    };

    state1 = postsReducer(state0, actions[1]);
  });

  test('should assign resteemed property correctly', () => {
    expect(state1.posts).toHaveLength(2);
    expect(state1.posts[0].resteemed).toBe(true);
  });
});
