import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Router } from 'react-router';
import { hot } from 'react-hot-loader';

import Home from './home';
import Login from './login';
import EventPage from './event_page';
import { EventSubmit } from './event_submit';
import EventSearch from './event_search';
import TravelPlans from './travel_plans';
import TravelPlanPage from './travel_plan_page';
import Imprint from './imprint';
import Header from '../components/header';
import Footer from '../components/footer';
import { I18n } from '@nerdgeschoss/i18n';
import ScrollToTop from '../components/scroll_to_top';
import ErrorCatcher from '../components/error_catcher';
import { State, history } from '../state';

interface Props {
  stateLoaded: boolean;
}

class Application extends React.Component<Props> {
  public componentDidMount() {
    I18n.onUpdate(() => this.forceUpdate());
  }

  public render() {
    if (!this.props.stateLoaded) {
      return null;
    }
    return (
      <Router history={history}>
        <ErrorCatcher>
          <div className="application">
            <Header />
            <main>
              <ScrollToTop>
                <ErrorCatcher>
                  <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/events" exact component={EventSearch} />
                    <Route
                      path="/events/submit"
                      exact
                      component={EventSubmit}
                    />
                    <Route path="/events/:id" exact component={EventPage} />
                    <Route path="/calendar" exact component={TravelPlans} />
                    <Route
                      path="/travel-plans/:id"
                      exact
                      component={TravelPlanPage}
                    />
                    <Route path="/imprint" exact component={Imprint} />
                  </Switch>
                </ErrorCatcher>
              </ScrollToTop>
            </main>
            <Footer />
          </div>
        </ErrorCatcher>
      </Router>
    );
  }
}

const mapStateToProps = (state: State) => ({ stateLoaded: !!state });
export default hot(module)(connect(mapStateToProps)(Application));
