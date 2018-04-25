import * as React from 'react';

interface Props {
  onClick?: () => void;
  active?: boolean;
}

export default class LikeButton extends React.Component<Props> {
  render() {
    const {onClick, active} = this.props;
    return (
      <a className={`like-button ${active && 'active'}`} onClick={onClick}>{active ? 'On my Calendar' : 'Add to Calendar'}</a>
    )
  }
}
