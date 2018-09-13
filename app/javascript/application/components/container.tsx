import * as React from 'react';

interface Props {
  variant?: 'default' | 'small';
}

export default class Container extends React.Component<Props> {
  static defaultProps = { variant: 'default' };

  render() {
    const { variant } = this.props;
    return (
      <div className={`container container--${variant}`}>
        {this.props.children}
      </div>
    );
  }
}
