import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Container>
          <nav className="main-menu">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/events">Events</NavLink>
          </nav>
        </Container>
      </header>
    )
  }
}
