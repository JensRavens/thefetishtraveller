import * as React from 'react';
import {NavLink} from 'react-router-dom';

import Container from './container';

export default class Header extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <NavLink to="/imprint">Imprint</NavLink>
        </Container>
      </footer>
    )
  }
}
