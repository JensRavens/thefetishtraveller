import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';

export default class Listing extends React.Component {
  render() {
    return (
      <div className="listing">
        {React.Children.map(this.props.children, (child) => <div className="listing__entry">{child}</div>)}
      </div>
    )
  }
}
