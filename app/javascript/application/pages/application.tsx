import * as React from 'react';
import {Route} from 'react-router';
import {BrowserRouter, NavLink} from 'react-router-dom';

import EventPage from './event_page';
import EventSearch from './event_search';
import Imprint from './imprint';
import Container from '../components/container';
import Header from '../components/header';
import Footer from '../components/footer';

require('./application.scss');

export default class Application extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="application">
          <Header/>
          <main>
            <Route path="/events" exact component={EventSearch}/>
            <Route path="/events/:id" exact component={EventPage}/>
            <Route path="/imprint" exact component={Imprint}/>
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    );
  }
}
