import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DB, State } from '../state';
import { scoped } from '@nerdgeschoss/i18n';
import {
  EventWithLocation,
  joinLocation,
  chronological,
  months,
  inMonth,
  matchesTerm,
  isRoot,
  joinSubevents,
  isCurrent,
} from '../models/event';
import { Like, isLiked } from '../models/like';
import { EventListing } from '../components/event_listing';
import { Meta } from '../components/meta';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import FilterBar from '../components/filter-bar';
import { Form } from '../components/form';
import TextInput from '../components/text-input';

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

interface SearchState {
  currentMonth?: string;
  term?: string;
}

const mapStateToProps: (state: State) => Props = state => {
  return {
    events: joinLocation(
      joinSubevents(
        new DB(state).table('events').all.sort(chronological),
        state
      ),
      state
    ),
    likes: new DB(state).table('likes').all,
  };
};

const t = scoped('event');

class EventSearch extends React.Component<Props, SearchState> {
  public state: SearchState = {};

  public render() {
    let { events } = this.props;
    const { likes } = this.props;
    const { currentMonth, term } = this.state;
    const options = months(events.filter(isCurrent));
    const selectedMonth = options.filter(e => e.name === currentMonth)[0];
    if (selectedMonth) {
      events = events.filter(e => inMonth(e, selectedMonth));
    }
    if (term && term.length) {
      events = events.filter(e => matchesTerm(e, term));
    } else {
      events = events.filter(isRoot).filter(isCurrent);
    }
    return (
      <React.Fragment>
        <Meta title={t('menu.events')} />
        <Hero>
          <Container>
            <h1>{t('menu.events')}</h1>
            <div className="hero__addon">
              <Form model={this.state} onInput={value => this.setState(value)}>
                <TextInput
                  name="term"
                  type="search"
                  placeholder={t('.search_place_holder')}
                />
              </Form>
            </div>
            <Link to="/events/submit" className="hero__cta">
              {t('.submit_here')}
            </Link>
          </Container>
        </Hero>
        <FilterBar
          options={[t('.all')].concat(options.map(e => e.name))}
          selectedOption={currentMonth || 'all'}
          onChange={option => this.setState({ currentMonth: option })}
        />
        <Listing>
          {events.map(e => (
            <EventListing key={e.id} event={e} liked={isLiked(e, likes)} />
          ))}
          <Link to="/events/submit" className="event-listing">
            <div className="event-listing__background" />
            <div className="event-listing__content">
              <div className="event-listing__category" />
              <div className="event-listing__name">{t('.event_missing')}</div>
              <div className="event-listing__description">
                {t('.submit_here')}
              </div>
              <div className="event-listing__details" />
            </div>
          </Link>
        </Listing>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(EventSearch);
