import React, { useState } from 'react';
import marked from 'marked';
import { useParams } from 'react-router';
import { formatEventDate } from '../models/event';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import {
  locationDescription,
  extractCoordinates,
  isVenue,
} from '../models/location';
import Container from '../components/container';
import Listing from '../components/listing';
import { Meta } from '../components/meta';
import { EventListing } from '../components/event_listing';
import { Map } from '../components/map';
import { scoped } from '@nerdgeschoss/i18n';
import { parseDate } from '../util';
import { JsonLd } from '../components/JsonLd';
import LikeButton from '../components/like-button';
import { Link } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { EventQuery, EventQueryVariables } from '../generated/EventQuery';
import { compact } from 'lodash';
import { useSession } from '../models/session';
import { ToggleLike, ToggleLikeVariables } from '../generated/ToggleLike';

marked.setOptions({ sanitize: true, breaks: true, smartypants: true });

function format(text: string): React.ReactNode {
  return <div dangerouslySetInnerHTML={{ __html: text ? marked(text) : '' }} />;
}

function link(url?: string | null) {
  return url ? (
    <a href={url} target="_blank">
      {url.replace(/https?\:\/\/(www\.)?/, '').split('/')[0]}
    </a>
  ) : null;
}

const t = scoped('event');

const DATA = gql`
  query EventQuery($slug: String!) {
    eventBySlug(slug: $slug) {
      id
      name
      slug
      categories
      liked
      startAt
      endAt
      fullDay
      organizerName
      website
      ticketLink
      abstract
      description
      hero {
        big
      }
      header {
        big
      }
      flyer {
        big
      }
      galleryImages {
        nodes {
          id
          medium
          big
        }
      }
      location {
        id
        category
        slug
        name
        city
        address
        zip
        countryCode
        lat
        lon
        timezone
      }
    }
  }
`;

const LIKE = gql`
  mutation ToggleLike($eventId: ID!, $like: Boolean!) {
    toggleLike(input: { eventId: $eventId, like: $like }) {
      event {
        id
        liked
      }
    }
  }
`;

export default function EventPage() {
  const [galleryIndex, setGalleryIndex] = useState<number | undefined>();
  const { id } = useParams<{ id: string }>();
  const [like] = useMutation<ToggleLike, ToggleLikeVariables>(LIKE);
  const { data, error } = useQuery<EventQuery, EventQueryVariables>(DATA, {
    variables: { slug: id },
  });
  if (error) {
    console.error(error);
  }
  const session = useSession();
  const event = data && data.eventBySlug;
  if (!event) {
    return null;
  }
  const subevents: any[] = [];
  const otherEvents: any[] = [];
  const hero =
    (event.header && event.header.big) || (event.hero && event.hero.big);
  const flyer = event.flyer && event.flyer.big;
  const coordinates = event.location && extractCoordinates(event.location);
  const meta = [
    [t('.date'), formatEventDate(event)],
    [t('.location'), event.location && locationDescription(event.location)],
    [t('.website'), link(event.website)],
    [t('.organizer'), event.organizerName],
    [t('.tickets'), link(event.ticketLink)],
  ].filter(e => e[1]);
  const previewImage = hero || flyer;
  const galleryImages = compact(event.galleryImages.nodes);
  return (
    <React.Fragment>
      <JsonLd
        data={{
          '@context': 'http://schema.org',
          '@type': 'Event',
          name: event.name,
          startDate: parseDate(event.startAt).toISOString(),
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
          endDate: parseDate(event.endAt).toISOString(),
        }}
      />
      <div className="main-menu__spacer" />
      <div className="spacer" />
      <Meta title={event.name} description={event.abstract || null} />
      {galleryIndex !== undefined && (
        <Lightbox
          mainSrc={galleryImages[galleryIndex].big}
          nextSrc={galleryImages[(galleryIndex + 1) % galleryImages.length].big}
          prevSrc={
            galleryImages[
              (galleryIndex + galleryImages.length - 1) % galleryImages.length
            ].big
          }
          onCloseRequest={() => setGalleryIndex(undefined)}
          onMovePrevRequest={() =>
            setGalleryIndex(
              (galleryIndex + galleryImages.length - 1) % galleryImages.length
            )
          }
          onMoveNextRequest={() =>
            setGalleryIndex((galleryIndex + 1) % galleryImages.length)
          }
        />
      )}
      <Container variant="small">
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
          {session && (
            <LikeButton
              active={event.liked}
              onClick={() =>
                like({ variables: { eventId: event.id, like: !event.liked } })
              }
            />
          )}
        </div>
        {event.description && format(event.description)}
        {flyer && (
          <div className="flyer">
            <img src={flyer} />
          </div>
        )}
      </Container>
      {galleryImages.length > 0 && (
        <Listing small>
          {galleryImages.map((image, index) => (
            <div
              key={image.medium}
              className="gallery__image"
              onClick={() => setGalleryIndex(index)}
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
            <h2>{t('.other_events_in', { location: event.location.name })}</h2>
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
