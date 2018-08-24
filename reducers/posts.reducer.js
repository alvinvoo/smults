import {STORE_SELECTED_TAGS,FETCH_AND_FILTER_POSTS,FILTER_POSTS} from '../actions';
import {POSTFIELDS,DEFAULTIMG} from './config.js';

import {isEqual, intersection, pick} from 'lodash';
import removeMd from 'remove-markdown';
import moment from 'moment';

const initialState ={
  posts: [],
  selectedTags: []
}

export default function(state=initialState,action){
  switch(action.type){
    case STORE_SELECTED_TAGS:
      console.log('store tags');
      return {...state, selectedTags:[...action.payload]};
    case FETCH_AND_FILTER_POSTS:
      console.log('fetch posts');
      // [...c].map(it=> {return _.pick(it,['id'])})
      const posts = [...action.payload].filter(post=>{
        //first get the tags
        const json = JSON.parse(post.json_metadata);
        const tags = json.tags? json.tags: '';
        if(tags==='') return false;
        const selectedTags = [...state.selectedTags];
        console.log('post tags');
        console.log(tags);
        console.log('selectedTags');
        console.log(selectedTags);
        //source should contain all the selected tags, regardless the order
        //if after intersect is equal back to the selected tags, means it matches
        const ret = _.isEqual(selectedTags,_.intersection(selectedTags,tags))
        console.log(ret);
        return ret;

        }
      ).map(post=>{
        //clean up json_metadata, filter out image[0] and tags only
        //clean up markdown, save back to body
        //before returning the array
        const f_post = _.pick(post,POSTFIELDS)
        const json = JSON.parse(post.json_metadata);
        const tags = json.tags? json.tags: '';
        const image = json.image? json.image[0]:DEFAULTIMG;
        const f_body = removeMd(post.body,{useImgAltText: false}).substring(0,120).replace(/[\r\n]/g, " ")+'...';
        const f_created = moment.utc(post.created).fromNow();

        //add back to f_post
        f_post.image = image;
        f_post.tags = tags;
        f_post.body = f_body;
        f_post.created = f_created;
        f_post.url = "https://steemit.com"+f_post.url;

        return f_post;
      });

      return {...state, posts};
    case FILTER_POSTS:
      console.log('filter posts');
      return state;
    default:
      return state;
  }
}
