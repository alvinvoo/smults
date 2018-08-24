import React, {Component} from 'react';
import {Item} from 'semantic-ui-react';
import Post from './Post';
import {connect} from 'react-redux';

class PostList extends Component{
  componentDidMount(){

  }

  render(){
    const {posts} = this.props.posts;
    return(
      <Item.Group link>
        {
          posts.map((post, index)=>{
            return <Post post={post} key={index}/>
          })
        }
      </Item.Group>

    )
  }
}

function mapStateToProps({posts}){
  return {posts};
}

export default connect(mapStateToProps)(PostList);
