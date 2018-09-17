import * as dsteem from 'dsteem';
import {
  STEEM_API, MAX_TAGS, MAX_POSTS, MAX_AUTHORS,
} from '../config';

export const FETCH_TRENDING_TAGS = 'FETCH_TRENDING_TAGS';
export const STORE_SELECTED_TAGS = 'STORE_SELECTED_TAGS';
export const LOOKUP_AUTHORS = 'LOOKUP_AUTHORS';
export const FETCH_AND_FILTER_POSTS = 'FETCH_AND_FILTER_POSTS';

const client = new dsteem.Client(STEEM_API);

export function fetchTrendingTags() {
  const request = client.database.call('get_trending_tags', [
    '',
    MAX_TAGS,
  ]);
  return {
    type: FETCH_TRENDING_TAGS,
    payload: request,
  };
}

function storeSelectedTags(tags, checkedCategory) {
  return {
    type: STORE_SELECTED_TAGS,
    payload: { tags, checkedCategory },
  };
}

export function lookupAuthors(search) {
  const request = client.call('condenser_api', 'get_account_reputations', [search, MAX_AUTHORS]);
  return {
    type: LOOKUP_AUTHORS,
    payload: request,
  };
}

function fetchAndFilterPosts(tag = '', filter) {
  const request = client.database.getDiscussions(filter, { tag, limit: MAX_POSTS });

  return {
    type: FETCH_AND_FILTER_POSTS,
    payload: request, // --> to redux promise
  };
}

async function fetchFilterByAuthor(author) {
  const blogs = await client.call('condenser_api', 'get_discussions_by_blog', [{ tag: author, limit: MAX_POSTS }]);

  const posts = blogs.map((blog) => {
    const retBlog = { ...blog };
    if (retBlog.author !== author) retBlog.resteemed = true;
    return retBlog;
  });

  return {
    type: FETCH_AND_FILTER_POSTS,
    payload: posts,
  };
}

// 1. store selected tags, 2. fetch posts based on first tag, 3. filter post
export function fetchPosts(tags, filter, author, checkedCategory) {
  return (dispatch) => {
    let retDispatch;
    dispatch(storeSelectedTags(tags, checkedCategory));
    if (filter === 'author') retDispatch = dispatch(fetchFilterByAuthor(author));
    else retDispatch = dispatch(fetchAndFilterPosts(tags[0], filter));

    return retDispatch;
  };
}
