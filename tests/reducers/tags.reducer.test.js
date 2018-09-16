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

test(`should return a state with has ${MAX_TAGS} minus 1 (empty) tag`, async () => {
  const store = mockStore({});
  await store.dispatch(fetchTrendingTags());
  const action = store.getActions()[0];
  const state = tagsReducer(initialState, action);
  const { trending_tags_options } = state;
  expect(trending_tags_options instanceof Array).toBe(true);
  expect(trending_tags_options).toHaveLength(MAX_TAGS - 1);
  expect(trending_tags_options).toEqual(expect.arrayContaining(initialState.trending_tags_options));
  expect(trending_tags_options).not.toEqual(expect.arrayContaining([{ key: '', value: '', text: '' }]));
});
