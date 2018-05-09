import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import {Calendar} from '../components/calendar';

interface Props {
  events: EventWithLocation[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  const eventIds = new DB(state).table('likes').all.map(e => e.eventId);
  return {
    events: joinLocation(new DB(state).table('events').where(e => eventIds.includes(e.id)).sort((a,b) => (a.startAt as any) - (b.startAt as any)), state),
  }
}

class TravelPlans extends React.Component<Props> {
  render() {
    const {events} = this.props;
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>Your Calendar</h1>
          </Container>
        </Hero>
        <Calendar events={events}/>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(TravelPlans)
