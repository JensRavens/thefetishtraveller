import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
  EventWithLocation,
  byMonth,
  byMainEvent,
  formatEventDate,
} from '../models/event';

import Container from './container';

interface Props {
  events: EventWithLocation[];
}

export class Calendar extends React.Component<Props> {
  public render() {
    const { events } = this.props;
    const months = byMonth(events);
    return (
      <div className="calendar">
        <div className="spacer" />
        <div className="calendar__line" />
        {months.map(month => (
          <section className="calendar__section" key={month.events[0].id}>
            <div className="calendar__month">
              <div className="calendar__timeline">
                <div className="calendar__date">
                  {moment(month.date).format('MMMM')}
                </div>
                <div className="calendar__year">{month.date.getFullYear()}</div>
              </div>
            </div>
            <Container variant="small">
              {byMainEvent(month.events).map(group => (
                <Link to={`/events/${group.event.slug}`} key={group.event.id}>
                  <div className="calendar__event">
                    {group.event.hero && (
                      <img
                        className="calendar__event__image"
                        src={group.event.hero.big}
                      />
                    )}
                    <div className="calendar__event__details">
                      <h2>{group.event.name}</h2>
                      <div className="calendar__event__date">
                        {formatEventDate(group.event)}
                      </div>
                      {group.events.map(e => (
                        <p>
                          {e.name}: {formatEventDate(e)}
                        </p>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </Container>
          </section>
        ))}
        <div className="spacer" />
      </div>
    );
  }
}
