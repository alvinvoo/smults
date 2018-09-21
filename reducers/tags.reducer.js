import { FETCH_TRENDING_TAGS } from '../actions';

export const initialState = {
  trending_tags_options: [
    { value: 'life', text: 'life' },
    { value: 'photography', text: 'photography' },
    { value: 'kr', text: 'kr' },
    { value: 'steemit', text: 'steemit' },
    { value: 'art', text: 'art' }],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TRENDING_TAGS: {
      const trendingTags = [...action.payload];
      const newTrendingTagsOptions = trendingTags.filter(tag => tag.name)
        .map(tag => ({ value: tag.name, text: tag.name }));
      return { ...state, trending_tags_options: [...newTrendingTagsOptions] };
    }
    default:
      return state;
  }
}
