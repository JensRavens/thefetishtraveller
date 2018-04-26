import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {scoped} from '../i18n';
import {EventWithLocation, joinLocation, chronological, months, inMonth, matchesTerm} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import FilterBar from '../components/filter-bar';
import Form from '../components/form';
import TextInput from '../components/text-input';

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

interface SearchState {
  currentMonth?: string;
  term?: string;
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: joinLocation(new DB(state).table('events').all.sort(chronological), state),
    likes: new DB(state).table('likes').all
  }
}

const t = scoped('event');

class EventSearch extends React.Component<Props, SearchState> {
  state: SearchState = {}

  render() {
    let {events, likes} = this.props;
    const {currentMonth, term} = this.state;
    const options = months(events);
    const selectedMonth = options.filter(e => e.name == currentMonth)[0];
    if(selectedMonth) {
      events = events.filter(e => inMonth(e, selectedMonth));
    }
    if(term) {
      events = events.filter(e => matchesTerm(e, term));
    }
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>{t('menu.events')}</h1>
            <div className="hero__addon">
              <Form model={this.state} onChange={(value) => this.setState(value)}>
                <TextInput name="term" type="search" placeholder={t('.search_place_holder')}/>
              </Form>
            </div>
          </Container>
        </Hero>
        <FilterBar options={[t('.all')].concat(options.map(e => e.name))} selectedOption={currentMonth || 'all'} onChange={option => this.setState({currentMonth: option})}/>
        <Listing>
          {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
        </Listing>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(EventSearch)
