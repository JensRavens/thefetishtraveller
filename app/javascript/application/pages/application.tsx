import * as React from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router';
import {BrowserRouter, NavLink} from 'react-router-dom';

import {State} from '../state';

import Home from './home';
import Login from './login';
import EventPage from './event_page';
import EventEdit from './event_edit';
import {EventSubmit} from './event_submit';
import EventSearch from './event_search';
import Calendar from './calendar';
import LocationSearch from './location_search';
import LocationCreation from './location_creation';
import LocationEdit from './location_edit';
import Imprint from './imprint';
import Container from '../components/container';
import Header from '../components/header';
import Footer from '../components/footer';
import {I18n} from '../i18n';

interface Props {
  stateLoaded: boolean;
}

class Application extends React.Component<Props> {
  componentDidMount() {
    I18n.onUpdate(() => this.forceUpdate());
  }

  render() {
    if(!this.props.stateLoaded) { return null; }
    return (
      <BrowserRouter>
        <div className="application">
          <Header/>
          <main>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/login" exact component={Login}/>
              <Route path="/events" exact component={EventSearch}/>
              <Route path="/events/submit" exact component={EventSubmit}/>
              <Route path="/events/:id" exact component={EventPage}/>
              <Route path="/events/:id/edit" exact component={EventEdit}/>
              <Route path="/calendar" exact component={Calendar}/>
              <Route path="/locations" exact component={LocationSearch}/>
              <Route path="/locations/new" exact component={LocationCreation}/>
              <Route path="/locations/:id/edit" exact component={LocationEdit}/>
              <Route path="/imprint" exact component={Imprint}/>
            </Switch>
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps: (State) => Props = (state) => ({stateLoaded: !!state});
export default connect(mapStateToProps)(Application);
