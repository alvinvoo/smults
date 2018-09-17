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
      const newAuthorsList = authorsList.map(author => ({ value: author, text: author }));
      return { ...state, authors_search_list: [...newAuthorsList] };
    }
    default:
      return state;
  }
}
