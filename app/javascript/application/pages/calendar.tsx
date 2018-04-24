import * as React from 'react';
import {connect} from 'react-redux';

import {DB, State} from '../state';
import {EventWithLocation, joinLocation} from '../models/event';
import {Like, isLiked} from '../models/like';
import {EventListing} from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';

interface Props {
  events: EventWithLocation[];
}

const mapStateToProps: (state: State) => Props = (state) => {
  const eventIds = new DB(state).table('likes').all.map(e => e.eventId);
  return {
    events: joinLocation(new DB(state).table('events').where(e => eventIds.includes(e.id)).sort((a,b) => (a.startAt as any) - (b.startAt as any)), state),
  }
}

class Calendar extends React.Component<Props> {
  render() {
    const {events} = this.props;
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>Your Calendar</h1>
          </Container>
        </Hero>
        <Container>
          <div className="listing">
            {events.map(e => <EventListing key={e.id} event={e}/>)}
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Calendar)
