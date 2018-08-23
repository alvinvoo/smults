import * as dsteem from 'dsteem'

export const FETCH_TRENDING_TAGS = 'FETCH_TRENDING_TAGS';
export const FETCH_POSTS = 'FETCH_POSTS';

const STEEM_API = 'https://api.steemit.com';
const MAX_TAGS = 16; //15 including the empty string
const MAX_POSTS = 5;
const client = new dsteem.Client(STEEM_API);

export function fetchTrendingTags(){
  const request = client.database.call('get_trending_tags', [
      "",
      MAX_TAGS,
  ]);

  return{
      type: FETCH_TRENDING_TAGS,
      payload: request
  }
}

export function fetchPosts(tag){
  const request = client.database.getDiscussions('created',{tag,limit: MAX_POSTS});

  return(dispatch)=>{
    dispatch({
      type: FETCH_POSTS,
      payload: request
    })
  }
}
