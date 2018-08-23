import * as dsteem from 'dsteem'

export const FETCH_TRENDING_TAGS = 'FETCH_TRENDING_TAGS';

const STEEM_API = 'https://api.steemit.com';
const client = new dsteem.Client(STEEM_API);

export function fetchTrendingTags(){
  const request = client.database.call('get_trending_tags', [
      "",
      16,
  ]);

  return{
    type: FETCH_TRENDING_TAGS,
    payload: request
  }

}
