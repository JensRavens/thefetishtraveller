import React from 'react';

interface Props {
  singleLine?: boolean;
}

export default class Listing extends React.Component<Props> {
  public render() {
    const { singleLine } = this.props;
    return (
      <div
        className={`listing listing--${
          singleLine ? 'single-line' : 'multi-line'
        }`}
      >
        {React.Children.map(this.props.children, child => (
          <div className="listing__entry">{child}</div>
        ))}
      </div>
    );
  }
}
