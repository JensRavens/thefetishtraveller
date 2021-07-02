import React from 'react';
import { flatten, uniq } from 'lodash';

import { EventWithLocation, formatEventDate } from '../models/event';
import { locationDescription } from '../models/location';
import { Link } from 'react-router-dom';

import { scoped } from '@nerdgeschoss/i18n';

interface Props {
  event: EventWithLocation;
  liked?: boolean;
}

const t = scoped('event');

export class EventListing extends React.Component<Props> {
  public render() {
    const { event, liked } = this.props;
    const backgroundImage =
      event.hero && event.hero.medium && `url(${event.hero.medium})`;
    const subcategories: string[] = flatten(
      (event.events || []).map((e) => e.categories || [])
    );
    const categories = (event.categories || []).concat(subcategories);
    const category = uniq(categories)
      .map((e) => t('.category.' + e))
      .join(', ');
    return (
      <Link
        to={`/events/${event.slug}`}
        className="event-listing"
        style={{ backgroundImage }}
      >
        <div className="event-listing__background" />
        <div className="event-listing__content">
          {liked && (
            <div className="event-listing__marker">On Your Calendar</div>
          )}
          <div className="event-listing__category">{category}</div>
          <div className="event-listing__name">{event.name}</div>
          <div className="event-listing__description" />
          <div className="event-listing__details">
            {locationDescription(event.location!)} <br />{' '}
            {formatEventDate(event)}
            {event.events && !!event.events.length && (
              <React.Fragment>
                <br />
                {event.events.length} subevents
              </React.Fragment>
            )}
          </div>
        </div>
      </Link>
    );
  }
}
