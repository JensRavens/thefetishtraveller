import * as React from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import { withRouter, RouteComponentProps } from 'react-router';
import { EventWithLocation, canEdit, joinLocation } from '../models/event';
import { isLiked } from '../models/like';
import {
  locationDescription,
  extractCoordinates,
  isVenue,
} from '../models/location';
import { DB, writeDB, State } from '../state';
import Container from '../components/container';
import Listing from '../components/listing';
import { Meta } from '../components/meta';
import { EventListing } from '../components/event_listing';
import { Map } from '../components/map';
import { dateRange } from '../util';
import { scoped } from '../i18n';
import { syncer } from '../api-syncer';
import { guid } from '../util';
import { JsonLd } from '../components/JsonLd';
import { isLoggedIn } from '../models/session';
import LikeButton from '../components/like-button';
import { EventForm } from './event_form';

marked.setOptions({ sanitize: true, breaks: true, smartypants: true });

interface Props {
  event?: EventWithLocation;
  liked: boolean;
  loggedIn: boolean;
  editable: boolean;
  otherEvents: EventWithLocation[];
  subevents: EventWithLocation[];
  changes?: Partial<EventWithChanges>;
  newEvent: boolean;
  history: any;
}

interface EventState {
  editing: boolean;
}

interface EventWithChanges extends Partial<EventWithLocation> {
  heroFile: File;
  headerFile: File;
  flyerFile: File;
}

function format(text: string): React.ReactNode {
  return <div dangerouslySetInnerHTML={{ __html: text ? marked(text) : '' }} />;
}

function link(url?: string) {
  return url ? (
    <a href={url} target="_blank">
      {url.replace(/https?\:\/\/(www\.)?/, '').split('/')[0]}
    </a>
  ) : null;
}

const t = scoped('event');

class EventPage extends React.Component<Props, EventState> {
  public state: EventState = { editing: false };
  public render() {
    let {
      event,
      liked,
      editable,
      otherEvents,
      subevents,
      loggedIn,
      changes,
    } = this.props;
    if (!event) {
      return null;
    }
    event = { ...event, ...changes };
    const hero =
      (event.header && event.header.big) || (event.hero && event.hero.big);
    const flyer = event.flyer && event.flyer.big;
    const coordinates = extractCoordinates(event.location);
    const editing = this.state.editing;
    const meta = [
      [t('.date'), dateRange(event.startAt, event.endAt)],
      [t('.location'), locationDescription(event.location)],
      [t('.website'), link(event.website)],
      [t('.organizer'), event.organizerName],
      [t('.tickets'), link(event.ticketLink)],
    ];
    const previewImage = hero || flyer;
    return (
      <React.Fragment>
        <JsonLd
          data={{
            '@context': 'http://schema.org',
            '@type': 'Event',
            name: event.name,
            startDate: event.startAt.toISOString(),
            location: {
              '@type': 'Place',
              name: event.location.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: event.location.address,
                postalCode: event.location.zip,
                addressCountry: event.location.countryCode,
                addressLocality: event.location.city,
              },
            },
            image: previewImage,
            description: event.abstract,
            endDate: event.endAt.toISOString(),
          }}
        />
        <div className="main-menu__spacer" />
        <div className="spacer" />
        <Meta title={event.name} description={event.abstract || null} />
        <Container variant="small">
          {editable &&
            !editing && (
              <div
                className="button"
                onClick={() => this.setState({ editing: true })}
              >
                {t('edit')}
              </div>
            )}
          {editing && (
            <React.Fragment>
              <EventForm event={event} />
              <div className="button" onClick={this.submit}>
                {t('save')}
              </div>
              <div className="button" onClick={this.cancelEditing}>
                {t('cancel')}
              </div>
              <br />
            </React.Fragment>
          )}
          <h2>{event.name}</h2>
          {event.abstract && (
            <React.Fragment>
              <h4>{event.abstract}</h4>
              <div className="spacer--small" />
            </React.Fragment>
          )}
          {hero && (
            <p>
              <img src={hero} />
            </p>
          )}
          <div className={`meta-box meta-box--${hero && 'floating'}`}>
            {meta.map(e => (
              <p key={e[0] as string}>
                <strong>{e[0]}</strong>
                <br />
                {e[1]}
              </p>
            ))}
            {loggedIn && (
              <LikeButton active={!!liked} onClick={this.toggleLike} />
            )}
          </div>
          {event.description && format(event.description)}
          {flyer && (
            <div className="flyer">
              <img src={flyer} />
            </div>
          )}
          <h3>{locationDescription(event.location)}</h3>
          {coordinates && (
            <Map
              center={coordinates}
              markerTitle={
                isVenue(event.location) ? event.location.name : undefined
              }
              zoom={isVenue(event.location) ? 16 : undefined}
            />
          )}
        </Container>
        {!!subevents.length && (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer" />
              <h2>{t('.happening_here', { location: event.location.name })}</h2>
              <div />
            </Container>
            <Listing>
              {subevents.map(e => (
                <EventListing key={e.id} event={e} />
              ))}
            </Listing>
          </React.Fragment>
        )}
        {!!otherEvents.length ? (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer" />
              <h2>
                {t('.other_events_in', { location: event.location.name })}
              </h2>
              <div />
            </Container>
            <Listing>
              {otherEvents.map(e => (
                <EventListing key={e.id} event={e} />
              ))}
            </Listing>
          </React.Fragment>
        ) : (
          <div className="spacer spacer--small" />
        )}
      </React.Fragment>
    );
  }

  toggleLike = () => {
    const likes = writeDB.table('likes');
    const eventId = this.props.event!.id;
    if (this.props.liked) {
      likes.update(likes.where({ eventId }), { state: 'deleted' });
    } else {
      likes.insert({ eventId, state: 'pending' });
    }
  };

  private onChange<T extends keyof EventWithChanges>(
    field: T,
    type: string = 'string'
  ) {
    return (value: string | File) => {
      let convertedValue: any = value;
      if (type === 'date') {
        const timestamp = Date.parse(convertedValue);
        convertedValue = isNaN(timestamp) ? null : new Date(timestamp);
      }
      this.update({ [field]: convertedValue });
    };
  }

  private update(values: Partial<EventWithChanges>) {
    const changes = { ...this.state.changes, ...values };
    const event = this.props.event!;
    Object.keys(changes).forEach(key => {
      if (changes[key] === event[key]) {
        delete changes[key];
      }
    });
    this.setState({ changes });
  }

  private submit = () => {
    const { changes } = this.state;
    if (Object.keys(changes).length === 0) {
      this.setState({ editing: false });
      return;
    }
    if (this.props.newEvent) {
      syncer.createEvent(this.props.event!.id, changes).then(event => {
        this.props.history.push(`/events/${event.slug}`);
      });
    } else {
      syncer.updateEvent(this.props.event!.id, changes).then(() => {
        this.setState({ changes: {}, editing: false });
      });
    }
  };

  private cancelEditing = () => {
    writeDB
      .context('local')
      .table('events')
      .revert(this.props.event!);
    this.setState({ editing: false });
  };
}

function buildEvent(): EventWithLocation {
  return {
    id: guid(),
    slug: '',
    name: 'New Event',
    startAt: new Date(),
    endAt: new Date(),
    locationId: '',
    locationSlug: 'change this',
    location: {
      id: '',
      slug: '',
      name: 'Change this',
      countryCode: 'de',
    },
  };
}

const mapStateToProps = (
  state: State,
  props: RouteComponentProps<{ id: string }>
) => {
  const slug: string = props.match.params.id;
  const db = new DB(state);
  const events = db.context('local').table('events');
  const newEvent = slug === 'new';
  const rawEvent = events.where({ slug })[0];
  const session = db.get('session');
  const loggedIn = isLoggedIn(session);
  const event: EventWithLocation | undefined = newEvent
    ? buildEvent()
    : joinLocation(rawEvent ? [rawEvent] : [], state)[0];
  const subevents: EventWithLocation[] =
    event && !newEvent
      ? joinLocation(
          events.where({ eventId: event.id }).filter(e => e.id !== event!.id),
          state
        )
      : [];
  const otherEvents: EventWithLocation[] =
    event && !newEvent
      ? joinLocation(
          events
            .where({ locationId: event.locationId })
            .filter(e => e.id !== event!.id),
          state
        )
      : [];
  const editable = canEdit(event, session) || newEvent;
  const liked = rawEvent && isLiked(rawEvent, db.table('likes').all);
  const changeSet = event && events.changesFor(event.id);
  const changes = changeSet && changeSet.changes;
  return {
    event,
    liked,
    editable,
    otherEvents,
    newEvent,
    subevents,
    loggedIn,
    changes,
  };
};

export default connect(mapStateToProps)(withRouter(EventPage));
