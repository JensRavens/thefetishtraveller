import React from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  Event,
  EventWithLocation,
  joinLocation,
  formatEventDate,
} from '../models/event';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { isLiked } from '../models/like';
import {
  locationDescription,
  extractCoordinates,
  isVenue,
  Location,
} from '../models/location';
import { DB, writeDB, State, history } from '../state';
import Container from '../components/container';
import Listing from '../components/listing';
import { Meta } from '../components/meta';
import { EventListing } from '../components/event_listing';
import { Map } from '../components/map';
import { scoped } from '@nerdgeschoss/i18n';
import { syncer } from '../api-syncer';
import { guid } from '../util';
import { JsonLd } from '../components/JsonLd';
import { isLoggedIn } from '../models/session';
import LikeButton from '../components/like-button';
import { EventForm } from './event_form';
import { Link } from 'react-router-dom';

marked.setOptions({ sanitize: true, breaks: true, smartypants: true });

interface Props {
  event?: EventWithLocation;
  liked: boolean;
  loggedIn: boolean;
  editable: boolean;
  otherEvents: EventWithLocation[];
  subevents: EventWithLocation[];
  changes?: Partial<Event>;
  possibleLocations: Location[];
}

interface EventState {
  editing: boolean;
  galleryIndex?: number;
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
    const {
      event,
      liked,
      editable,
      otherEvents,
      subevents,
      loggedIn,
      possibleLocations,
    } = this.props;
    if (!event) {
      return null;
    }
    const hero =
      (event.header && event.header.big) || (event.hero && event.hero.big);
    const flyer = event.flyer && event.flyer.big;
    const coordinates = event.location && extractCoordinates(event.location);
    const { editing, galleryIndex } = this.state;
    const meta = [
      [t('.date'), formatEventDate(event)],
      [t('.location'), event.location && locationDescription(event.location)],
      [t('.website'), link(event.website)],
      [t('.organizer'), event.organizerName],
      [t('.tickets'), link(event.ticketLink)],
    ].filter(e => e[1]);
    const previewImage = hero || flyer;
    return (
      <React.Fragment>
        <JsonLd
          data={{
            '@context': 'http://schema.org',
            '@type': 'Event',
            name: event.name,
            startDate: event.startAt.toISOString(),
            location: event.location && {
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
        {galleryIndex !== undefined && (
          <Lightbox
            mainSrc={event.galleryImages[galleryIndex].big}
            nextSrc={
              event.galleryImages[
                (galleryIndex + 1) % event.galleryImages.length
              ].big
            }
            prevSrc={
              event.galleryImages[
                (galleryIndex + event.galleryImages.length - 1) %
                  event.galleryImages.length
              ].big
            }
            onCloseRequest={() => this.setState({ galleryIndex: undefined })}
            onMovePrevRequest={() =>
              this.setState({
                galleryIndex:
                  (galleryIndex + event.galleryImages.length - 1) %
                  event.galleryImages.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                galleryIndex: (galleryIndex + 1) % event.galleryImages.length,
              })
            }
          />
        )}
        <Container variant="small">
          {editable && !editing && (
            <div
              className="button"
              onClick={() => this.setState({ editing: true })}
            >
              {t('edit')}
            </div>
          )}
          {editing && (
            <React.Fragment>
              <EventForm event={event} possibleLocations={possibleLocations} />
              <div className="button" onClick={this.submit}>
                {t('save')}
              </div>
              <div className="button" onClick={this.cancelEditing}>
                {t('cancel')}
              </div>
            </React.Fragment>
          )}
          {editable && <div className="spacer spacer--small" />}
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
        </Container>
        {event.galleryImages.length > 0 && (
          <Listing small>
            {event.galleryImages.map((image, index) => (
              <div
                className="gallery__image"
                onClick={() => this.setState({ galleryIndex: index })}
              >
                <img src={image.medium} />
              </div>
            ))}
          </Listing>
        )}
        {event.location && (
          <Container>
            <div className="spacer spacer--small" />
            <h3>
              <Link to={`/locations/${event.location.slug}`}>
                {locationDescription(event.location)}
              </Link>
            </h3>
            <div />
          </Container>
        )}
        {coordinates && event.location && (
          <Map
            center={coordinates}
            markerTitle={
              isVenue(event.location) ? event.location.name : undefined
            }
            zoom={isVenue(event.location) ? 16 : undefined}
          />
        )}

        {!!subevents.length && event.location && (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer spacer--small" />
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
        {!!otherEvents.length && event.location ? (
          <React.Fragment>
            <Container variant="small">
              <div className="spacer spacer--small" />
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

  private toggleLike = () => {
    const likes = writeDB.table('likes');
    const eventId = this.props.event!.id;
    if (this.props.liked) {
      likes.update(likes.where({ eventId }), { state: 'deleted' });
    } else {
      likes.insert({ eventId, state: 'pending' });
    }
  };

  private submit = async () => {
    const { changes, event: localEvent } = this.props;

    if (localEvent && changes && Object.keys(changes).length > 0) {
      if (localEvent.unsubmitted) {
        syncer
          .createEvent(localEvent.id, { ...changes, slug: undefined })
          .then(event => {
            // history.replace(`/events/${event.slug}`);
          });
      } else {
        await syncer.updateEvent(localEvent.id, changes);
      }
    }

    this.setState({ editing: false });
  };

  private cancelEditing = () => {
    writeDB.context('local').revert();
    this.setState({ editing: false });
  };
}

function buildEvent(): Event {
  const event: Event = {
    id: guid(),
    slug: '',
    name: 'New Event',
    startAt: new Date(),
    endAt: new Date(),
    locationId: '',
    fullDay: true,
    editable: true,
    unsubmitted: true,
    galleryImages: [],
  };
  writeDB
    .context('local')
    .table('events')
    .insert(event);
  return event;
}

function mapStateToProps(
  state: State,
  props: RouteComponentProps<{ id: string }>
): Props {
  const slug: string = props.match.params.id;
  const db = new DB(state);
  const events = db.context('local').table('events');
  if (slug === 'new') {
    const id = buildEvent().id;
    history.replace(`/events/${id}`);
  }
  const rawEvent = events.where(e => e.slug === slug || e.id === slug)[0];
  const session = db.get('session');
  const loggedIn = isLoggedIn(session);
  const event: EventWithLocation | undefined = joinLocation(
    rawEvent ? [rawEvent] : [],
    state
  )[0];
  const subevents: EventWithLocation[] = event
    ? joinLocation(
        events.where({ eventId: event.id }).filter(e => e.id !== event!.id),
        state
      )
    : [];
  const otherEvents: EventWithLocation[] = event
    ? joinLocation(
        events
          .where({ locationId: event.locationId })
          .filter(e => e.id !== event!.id),
        state
      )
    : [];
  const possibleLocations = db.table('locations').all;
  const editable = !!event.editable;
  const liked = rawEvent && isLiked(rawEvent, db.table('likes').all);
  const changeSet = event && events.changesFor(event.id);
  const changes = changeSet && changeSet.changes;
  return {
    event,
    liked,
    editable,
    otherEvents,
    subevents,
    loggedIn,
    changes,
    possibleLocations,
  };
}

export default connect(mapStateToProps)(withRouter(EventPage as any));
