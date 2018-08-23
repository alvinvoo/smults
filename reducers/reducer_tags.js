import {FETCH_TRENDING_TAGS, FETCH_POSTS} from '../actions';
import {xor} from 'lodash';

const initialState ={
  trending_tags_options: [
    {key: 'life', value : 'life', text: 'life'},
    {key: 'photography', value : 'photography', text: 'photography'},
    {key: 'kr', value : 'kr', text: 'kr'},
    {key: 'steemit', value : 'steemit', text: 'steemit'},
    {key: 'art', value : 'art', text: 'art'}],
  selected_tags: [],
  posts: []
}

export default function(state=initialState,action){
  switch(action.type){
    case FETCH_TRENDING_TAGS:
      console.log('fetch_trending_tags');
      const trending_tags = [...action.payload];
      const new_trending_tags_options = trending_tags.filter(tag => tag.name).map(tag=>{
        return {key: tag.name, value: tag.name, text: tag.name};
      });
      // console.log(new_trending_tags_options);
      return {...state, trending_tags_options:[...new_trending_tags_options]};
    case FETCH_POSTS:
      console.log('fetch posts');
      const posts = [...action.payload];
      return {...state, posts:[...action.payload]};
    default:
      return state;
  }
}
