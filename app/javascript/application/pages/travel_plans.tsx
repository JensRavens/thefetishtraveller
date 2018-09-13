import * as React from 'react';
import { connect } from 'react-redux';

import { DB, State } from '../state';
import { EventWithLocation, joinLocation } from '../models/event';
import { Like, isLiked } from '../models/like';
import { EventListing } from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import { Calendar } from '../components/calendar';
import { scoped } from '../i18n';

interface Props {
  userId: string;
  events: EventWithLocation[];
}

const mapStateToProps: (state: State) => Props = state => {
  const db = new DB(state);
  const eventIds = db.table('likes').all.map(e => e.eventId);
  return {
    events: joinLocation(
      db
        .table('events')
        .where(e => eventIds.includes(e.id))
        .sort((a, b) => (a.startAt as any) - (b.startAt as any)),
      state
    ),
    userId: db.get('session')!.userId,
  };
};

const t = scoped('calendar');

class TravelPlans extends React.Component<Props> {
  render() {
    const { events, userId } = this.props;
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>{t('.heading')}</h1>
            {events.length && (
              <div className="hero__addon text-center">
                <a
                  className="button"
                  href={`webcal://${
                    location.host
                  }/feed/events?user_id=${userId}`}
                >
                  {t('.subscribe')}
                </a>
              </div>
            )}
          </Container>
        </Hero>
        <Calendar events={events} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(TravelPlans);
