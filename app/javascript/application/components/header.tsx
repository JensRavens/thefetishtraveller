import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import Container from './container';
import {State, DB} from '../state';

interface Props {
  loggedIn: boolean;
  hasLikes: boolean;
}

class Header extends React.Component<Props> {
  render() {
    const {loggedIn, hasLikes} = this.props;
    return (
      <header className="header">
        <Container>
          <nav className="main-menu">
            <div className="main-menu__category">
              <NavLink to="/">The Fetish Traveller</NavLink>
            </div>
            <div className="main-menu__category">
              <NavLink to="/events">Events</NavLink>
              {hasLikes && <NavLink to="/calendar">Your Calendar</NavLink>}
              {loggedIn && <NavLink to="/locations">Locations</NavLink>}
            </div>
          </nav>
        </Container>
      </header>
    )
  }
}

const mapStateToProps: (state: State) => Props = (state) => {
  const hasLikes = new DB(state).table('likes').all.length > 0;
  return {loggedIn: state.settings.session.level === "user", hasLikes};
}

export default connect(mapStateToProps)(Header);
