import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Post from './Post';

export const PostList = (props) => {
  const { posts } = props;
  return (
    <Item.Group link>
      {
        posts.map(post => <Post post={post} key={post.id} />)
      }
    </Item.Group>

  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps({ posts }) {
  return { posts: posts.posts, selectedTags: posts.selectedTags };
}

export default connect(mapStateToProps)(PostList);
