import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import Container from './container';
import {State} from '../state';

interface Props {
  loggedIn: boolean;
}

class Header extends React.Component<Props> {
  render() {
    const {loggedIn} = this.props;
    return (
      <header className="header">
        <Container>
          <nav className="main-menu">
            <div className="main-menu__category">
              <NavLink to="/">The Fetish Traveller</NavLink>
            </div>
            <div className="main-menu__category">
              <NavLink to="/events">Events</NavLink>
              {loggedIn && <NavLink to="/locations">Locations</NavLink>}
            </div>
          </nav>
        </Container>
      </header>
    )
  }
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {loggedIn: state.settings.session.level === "user"};
}

export default connect(mapStateToProps)(Header);
