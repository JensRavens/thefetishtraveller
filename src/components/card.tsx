import React from 'react';

export default class Card extends React.Component {
  public render() {
    return (
      <div className="card">
        <div className="card__body">{this.props.children}</div>
      </div>
    );
  }
}
