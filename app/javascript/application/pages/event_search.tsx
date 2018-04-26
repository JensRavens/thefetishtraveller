import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation, chronological, months, inMonth} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import FilterBar from '../components/filter-bar';

interface Props {
  events: EventWithLocation[];
  likes: Like[];
}

interface SearchState {
  currentMonth?: string;
}

const mapStateToProps: (state: State) => Props = (state) => {
  return {
    events: joinLocation(new DB(state).table('events').all.sort(chronological), state),
    likes: new DB(state).table('likes').all
  }
}

class EventSearch extends React.Component<Props, SearchState> {
  state: SearchState = {}

  render() {
    let {events, likes} = this.props;
    const {currentMonth} = this.state;
    const options = months(events);
    const selectedMonth = options.filter(e => e.name == currentMonth)[0];
    if(selectedMonth) {
      events = events.filter(e => inMonth(e, selectedMonth));
    }
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>Events</h1>
          </Container>
        </Hero>
        <FilterBar options={['all'].concat(options.map(e => e.name))} selectedOption={currentMonth || 'all'} onChange={option => this.setState({currentMonth: option})}/>
        <Listing>
          {events.map(e => <EventListing key={e.id} event={e} liked={isLiked(e, likes)}/>)}
        </Listing>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(EventSearch)
