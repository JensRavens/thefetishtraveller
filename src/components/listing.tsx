import React from 'react';
import classnames from 'classnames';

interface Props {
  singleLine?: boolean;
  small?: boolean;
}

export default class Listing extends React.Component<Props> {
  public render() {
    const { singleLine, small } = this.props;
    return (
      <div
        className={classnames('listing', {
          'listing--single-line': singleLine,
          'listing--small': small,
        })}
      >
        {React.Children.map(this.props.children, child => (
          <div className="listing__entry">{child}</div>
        ))}
      </div>
    );
  }
}
