import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';

export default class Header extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <div className="footer__category">
            <div className="logo">The <em>Fetish</em> Traveller</div>
            <div className="footer__copyright">© 2018 Jens Ravens<br/>All Rights Reserved</div>
          </div>
          <div className="footer__category">
            <div className="footer__headline">About us</div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
            </p>
          </div>
          <nav className="footer__category">
            <div className="footer__headline">Quick Navigation</div>
            <NavLink to="/">Home</NavLink><br/>
            <NavLink to="/imprint">Imprint</NavLink>
          </nav>
        </Container>
      </footer>
    )
  }
}
