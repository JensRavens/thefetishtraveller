import * as React from 'react';

require('./container.scss');

export default class Container extends React.Component {
  render() {
    return (
      <div className="container">{this.props.children}</div>
    )
  }
}
