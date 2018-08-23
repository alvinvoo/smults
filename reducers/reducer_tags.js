import {FETCH_TRENDING_TAGS} from '../actions';

export default function(state={},action){
  switch(action.type){
    case FETCH_TRENDING_TAGS:
      console.log('fetch_trending_tags');
      console.log(action.payload.length);
      return {...state, ...action.payload};
    default:
      return state;
  }
}
