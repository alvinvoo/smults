import configureStore from 'redux-mock-store';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import tagsReducer, { initialState } from '../../reducers/tags.reducer';
import { fetchTrendingTags } from '../../actions';
import { MAX_TAGS } from '../../config';

const mockStore = configureStore([ReduxPromise, ReduxThunk]);

test('should set default state', () => {
  const state = tagsReducer(undefined, { type: '@@INIT' });
  expect(state).toBe(initialState);
});

describe('Testing async functions related to tags reducers', () => {
  let action;
  let trending_tags_options;

  beforeAll(async () => {
    const store = mockStore({});
    await store.dispatch(fetchTrendingTags());
    [action] = store.getActions();
    const state = tagsReducer(initialState, action);
    ({ trending_tags_options } = state);
  });

  test(`should return a state with has ${MAX_TAGS} minus 1 (empty) tag`, async () => {
    expect(trending_tags_options instanceof Array).toBe(true);
    expect(trending_tags_options).toHaveLength(MAX_TAGS - 1);
  });

  test('should return a state which contain no empty values', () => {
    expect(trending_tags_options).not.toEqual(expect.arrayContaining([{ value: '', text: '' }]));
  });

  test('should have property key \'value\' and \'text\' in the returned state', () => {
    trending_tags_options.forEach((tag) => {
      expect(tag).toHaveProperty('value');
      expect(tag).toHaveProperty('text');
    });
  });
});
