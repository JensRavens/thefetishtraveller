import React from 'react';

interface Props {
  variant?: 'default' | 'small';
}

export default class Container extends React.Component<Props> {
  public static defaultProps = { variant: 'default' };

  public render() {
    const { variant } = this.props;
    return (
      <div className={`container container--${variant}`}>
        {this.props.children}
      </div>
    );
  }
}
