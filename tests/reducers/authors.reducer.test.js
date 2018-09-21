import configureStore from 'redux-mock-store';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import authorReducer, { initialState } from '../../reducers/authors.reducer';
import { lookupAuthors } from '../../actions';
import { MAX_POSTS } from '../../config';

const mockStore = configureStore([ReduxPromise, ReduxThunk]);

test('should set default state', () => {
  const state = authorReducer(undefined, { type: '@@INIT' });
  expect(state).toBe(initialState);
});

describe('Testing async functions related to authors reducers', () => {
  let action;
  let authors_search_list;

  beforeAll(async () => {
    const store = mockStore({});
    await store.dispatch(lookupAuthors('alvin'));
    // don't get confused; Array destructuring for first item
    [action] = store.getActions();
    const state = authorReducer(initialState, action);
    // to destructure and assign to a pre-declared variable
    ({ authors_search_list } = state);
  });

  test(`should return a state with at most ${MAX_POSTS} authors`, () => {
    expect(authors_search_list instanceof Array).toBe(true);
    expect(authors_search_list.length).toBeLessThanOrEqual(MAX_POSTS);
  });

  test('should have property key \'value\' and \'text\' in the returned state', () => {
    authors_search_list.forEach((author) => {
      expect(author).toHaveProperty('value');
      expect(author).toHaveProperty('text');
    });
  });

  test('should return authors where their reputation is > 0', async () => {
    const respectableAuthors = action.payload
      .filter(author => author.reputation > 0)
      .map(author => author.account);
    const authors = authors_search_list.map(author => author.value);
    expect(respectableAuthors).toEqual(authors);
  });

  test('should return a state with authors where their regex matches the search query', async () => {
    const authors = authors_search_list.map(author => author.value);
    expect(authors).toEqual(expect.arrayContaining([expect.stringMatching(/^alvin/)]));
  });
});
