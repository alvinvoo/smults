import { LOOKUP_AUTHORS } from '../actions';

export const initialState = {
  authors_search_list: [
    { value: 'alvinvoo', text: 'alvinvoo' },
  ],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOOKUP_AUTHORS: {
      const authorsList = [...action.payload];
      const newAuthorsList = authorsList
        .filter(author => author.reputation > 0)
        .map(author => ({ value: author.account, text: author.account }));
      return { ...state, authors_search_list: [...newAuthorsList] };
    }
    default:
      return state;
  }
}
