import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';

interface Props {
  singleLine?: boolean;
}

export default class Listing extends React.Component<Props> {
  render() {
    const {singleLine} = this.props;
    return (
      <div className={`listing listing--${singleLine ? 'single-line' : 'multi-line'}`}>
        {React.Children.map(this.props.children, (child) => <div className="listing__entry">{child}</div>)}
      </div>
    )
  }
}
