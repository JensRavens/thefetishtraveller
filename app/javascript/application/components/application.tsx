import * as React from 'react';
import {Route} from 'react-router';
import {BrowserRouter, NavLink} from 'react-router-dom';

import EventPage from './event_page';
import EventSearch from './event_search';
import Container from './container';

export default class Application extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <header className="header">
            <Container>
              <nav className="main-menu">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/events">Events</NavLink>
              </nav>
            </Container>
          </header>
          <main>
            <Route path="/events" exact component={EventSearch}/>
            <Route path="/events/:id" exact component={EventPage}/>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
