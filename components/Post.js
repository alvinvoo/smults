import React from 'react';
import {Image, Item, Icon, Label} from 'semantic-ui-react';

export default props => {
  const {image, title, author, category, created, body, pending_payout_value, net_votes, children, url} = props.post;

  return(
      <Item href={url} target="_blank">
        <Item.Image size='small' src={image} />
        <Item.Content>
          <Item.Header>{title}</Item.Header>
          <Item.Meta><Label color="purple">{author}</Label> in <Label color="teal" tag>{category}</Label> • {created}</Item.Meta>
          <Item.Description>
            {body}
          </Item.Description>
          <Item.Extra><Icon name='dollar'/>{pending_payout_value}    <Icon name='sort up'/>{net_votes}    <Icon name='comment outline'/>{children}</Item.Extra>
        </Item.Content>
      </Item>
  )
}
