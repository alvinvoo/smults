import { FETCH_TRENDING_TAGS } from '../actions';

export const initialState = {
  trending_tags_options: [
    { key: 'life', value: 'life', text: 'life' },
    { key: 'photography', value: 'photography', text: 'photography' },
    { key: 'kr', value: 'kr', text: 'kr' },
    { key: 'steemit', value: 'steemit', text: 'steemit' },
    { key: 'art', value: 'art', text: 'art' }],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_TRENDING_TAGS: {
      const trendingTags = [...action.payload];
      const newTrendingTagsOptions = trendingTags.filter(tag => tag.name)
        .map(tag => ({ key: tag.name, value: tag.name, text: tag.name }));
      return { ...state, trending_tags_options: [...newTrendingTagsOptions] };
    }
    default:
      return state;
  }
}
