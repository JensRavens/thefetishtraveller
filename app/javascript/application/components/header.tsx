import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import Container from './container';
import {State, DB} from '../state';
import {isLoggedIn} from '../models/session';

interface Props {
  loggedIn: boolean;
  hasLikes: boolean;
}

interface MenuState {
  expanded: boolean;
}

class Header extends React.Component<Props, MenuState> {
  state = {expanded: false}

  render() {
    const {loggedIn, hasLikes} = this.props;
    const {expanded} = this.state;
    const content = (
      <React.Fragment>
        <div className="main-menu__category">
          <NavLink to="/events">Events</NavLink>
          {loggedIn && <NavLink to="/locations">Locations</NavLink>}
        </div>
        <div className="main-menu__category">
          {hasLikes && <NavLink to="/calendar">Your Calendar</NavLink>}
        </div>
      </React.Fragment>
    )
    return (
      <header className="header">
        <nav className={`main-menu ${expanded && 'main-menu--expanded'}`}>
          <div className="main-menu__category logo">
            <NavLink to="/">The <em>Fetish</em> Traveller</NavLink>
          </div>
          <nav className="main-menu__mobile">
            <div className="main-menu__category">
              <NavLink to="/events">Events</NavLink>
              {loggedIn && <NavLink to="/locations">Locations</NavLink>}
            </div>
            <div className="main-menu__category">
              {hasLikes && <NavLink to="/calendar">Your Calendar</NavLink>}
            </div>
          </nav>
          <div className="main-menu__switch" onClick={() => this.setState({expanded: !expanded})}/>
          <div className="main-menu__category main-menu__category--additional">
            <NavLink to="/events">Events</NavLink>
            {loggedIn && <NavLink to="/locations">Locations</NavLink>}
          </div>
          <div className="main-menu__category main-menu__category--additional">
            {hasLikes && <NavLink to="/calendar">Your Calendar</NavLink>}
          </div>
        </nav>
      </header>
    )
  }
}

const mapStateToProps: (state: State) => Props = (state) => {
  const hasLikes = new DB(state).table('likes').all.length > 0;
  const loggedIn = isLoggedIn(state.settings.session);
  return {loggedIn, hasLikes};
}

export default connect(mapStateToProps)(Header);
