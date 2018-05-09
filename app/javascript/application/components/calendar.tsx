import * as React from 'react';
import * as moment from 'moment';

import {EventWithLocation, byMonth, formatDate} from '../models/event';

import Container from './container';

interface Props {
  events: EventWithLocation[];
}

export class Calendar extends React.Component<Props> {
  render() {
    const {events} = this.props;
    const months = byMonth(events);
    console.log(months);
    return (
      <div className="calendar">
        <div className="calendar__line"/>
        {
          months.map(month => (
            <section className="calendar__section" key={month.events[0].id}>
              <div className="calendar__month">
                <div className="calendar__timeline">
                  <div className="calendar__date">{moment(month.date).format('MMMM')}</div>
                  <div className="calendar__year">{month.date.getFullYear()}</div>
                </div>
              </div>
              <Container variant="small">
                {
                  month.events.map(event => (
                    <div key={event.id} className="calendar__event">
                      {event.hero && <img className="calendar__event__image" src={event.hero.big}/>}
                      <div className="calendar__event__details">
                        <h2>{event.name}</h2>
                        <div className="calendar__event__date">{formatDate(event)}</div>
                        {event.abstract && <p>{event.abstract}</p> }
                      </div>
                    </div>
                  ))
                }
              </Container>
            </section>
          ))
        }
      </div>
    )
  }
}
