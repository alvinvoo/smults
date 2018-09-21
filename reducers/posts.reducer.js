import { isEqual, intersection, pick } from 'lodash';
import removeMd from 'remove-markdown';
import moment from 'moment';
import { POSTFIELDS, DEFAULTIMG } from '../config';
import {
  STORE_SELECTED_TAGS, FETCH_AND_FILTER_POSTS, STORED_TAGS, FETCHED_POSTS,
} from '../actions';

export const initialState = {
  posts: [],
  selectedTags: [],
  firstTagIsCategory: false,
  reducerState: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case STORE_SELECTED_TAGS:
      return {
        ...state,
        selectedTags: [...action.payload.tags],
        firstTagIsCategory: action.payload.checkedCategory,
        reducerState: STORED_TAGS,
      };
    case FETCH_AND_FILTER_POSTS: {
      const posts = [...action.payload].filter((post) => {
        // first get the tags
        const json = JSON.parse(post.json_metadata);
        const tags = json.tags ? json.tags : '';
        if (tags === '') return false;
        const selectedTags = [...state.selectedTags];
        const { firstTagIsCategory } = state;

        let ret = false;
        // if check box is ticked, check whether first tag equals to selected first tag
        if (firstTagIsCategory) {
          if (selectedTags[0] === tags[0]) ret = isEqual(selectedTags, intersection(selectedTags, tags));
        } else {
          // source should contain all the selected tags, regardless of the order
          // if after intersect is equal back to the selected tags, means it matches
          ret = isEqual(selectedTags, intersection(selectedTags, tags));
        }

        return ret;
      }).map((post) => {
        // clean up json_metadata, filter out image[0] and tags only
        // clean up markdown, save back to body
        // before returning the array
        const fPost = pick(post, POSTFIELDS);
        const json = JSON.parse(post.json_metadata);
        const image = json.image && json.image.length > 0 ? json.image[0] : DEFAULTIMG;
        const fBody = `${removeMd(post.body, { useImgAltText: false }).substring(0, 120).replace(/[\r\n]/g, ' ')}...`;
        const fCreated = moment.utc(post.created).fromNow();

        // add back to fPost
        fPost.resteemed = fPost.resteemed ? fPost.resteemed : undefined;
        fPost.image = image;
        fPost.tags = json.tags;
        fPost.body = fBody;
        fPost.created = fCreated;
        fPost.url = `https://steemit.com${fPost.url}`;

        return fPost;
      });

      return { ...state, posts, reducerState: FETCHED_POSTS };
    }
    default:
      return state;
  }
}
