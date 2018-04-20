import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';
import Login from './login';

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Container>
          <nav className="main-menu">
            <NavLink to="/">Events</NavLink>
            <Login/>
          </nav>
        </Container>
      </header>
    )
  }
}
