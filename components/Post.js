import React from 'react';
import PropTypes from 'prop-types';
import {
  Item, Icon, Label,
} from 'semantic-ui-react';

export default function Post(props) {
  const { post } = props;
  const {
    image, title, author, category, created, body,
    pending_payout_value, total_payout_value, net_votes,
    children, tags, url, resteemed,
  } = post;

  return (
    <Item href={url} target="_blank">
      <Item.Image size="small" src={image} />
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Meta>
          {
            resteemed ? (
              <Label>
                <Icon name="share" />
              resteemed
              </Label>
            ) : (
              <div />
            )
          }
          <Label color="purple">{author}</Label>
          {' '}
          in
          {' '}
          <Label color="teal" tag>{category}</Label>
          {' '}
          •
          {' '}
          {created}
        </Item.Meta>
        <Item.Description>
          {body}
        </Item.Description>
        <Item.Extra>
          <Icon name="dollar" />
          { pending_payout_value && pending_payout_value === '0.000 SBD' ? total_payout_value : pending_payout_value }
          <Icon name="sort up" />
          {net_votes}
          <Icon name="comment outline" />
          {children}
          <span style={{ margin: '0 .5em' }} />
          {
              tags.map((tag, index) => <Label key={index}>{tag}</Label>)
            }
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

Post.propTypes = {
  post: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  ).isRequired,
};
