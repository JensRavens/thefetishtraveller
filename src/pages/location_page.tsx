import React from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import { gql, useQuery } from '@apollo/client';
import { withRouter, RouteComponentProps, useParams } from 'react-router';
import {
  extractCoordinates,
  isVenue,
  Location,
  countryName,
} from '../models/location';
import { DB, State } from '../state';
import Container from '../components/container';
import { Meta } from '../components/meta';
import { Map } from '../components/map';
import { scoped } from '@nerdgeschoss/i18n';
import Listing from '../components/listing';
import { EventWithLocation } from '../models/event';
import { EventListing } from '../components/event_listing';
import {
  LocationQuery,
  LocationQueryVariables,
} from '../generated/LocationQuery';
import { compact } from 'lodash';

interface Props {
  location?: Location;
  relatedLocations: Location[];
  events: EventWithLocation[];
}

const t = scoped('location');

const LOCATION = gql`
  query LocationQuery($slug: String!) {
    locationBySlug(slug: $slug) {
      id
      name
      city
      countryName
      lat
      lon
      category
      events {
        nodes {
          id
          name
          slug
          endAt
          startAt
          fullDay
          categories
          hero {
            medium
          }
          location {
            id
            name
            city
            category
            countryName
          }
        }
      }
    }
  }
`;

export default function LocationPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useQuery<LocationQuery, LocationQueryVariables>(
    LOCATION,
    { variables: { slug: id } }
  );
  if (error) {
    console.log(error);
  }
  const location = data && data.locationBySlug;
  if (!location) {
    return null;
  }
  const events = compact(location.events.nodes!);
  const coordinates = extractCoordinates(location);
  const meta = [
    [t('.city'), location.city],
    [t('.country'), location.countryName],
  ].filter(e => e[1]);
  return (
    <>
      <div className="main-menu__spacer" />
      <div className="spacer" />
      <Meta title={location.name} />
      <Container variant="small">
        <h2>{location.name}</h2>
        <div className={`meta-box meta-box--${false && 'floating'}`}>
          {meta.map(e => (
            <p key={e[0] as string}>
              <strong>{e[0]}</strong>
              <br />
              {e[1]}
            </p>
          ))}
        </div>
      </Container>
      {coordinates && (
        <>
          <div className="spacer--small" />
          <Map
            center={coordinates}
            zoom={location.category === 'venue' ? 16 : undefined}
          />
        </>
      )}
      {!!events.length ? (
        <React.Fragment>
          <Container variant="small">
            <div className="spacer" />
            <h2>{t('.events_in', { name: location.name })}</h2>
            <div />
          </Container>
          <Listing>
            {events.map(e => (
              <EventListing key={e.id} event={e} />
            ))}
          </Listing>
        </React.Fragment>
      ) : (
        <div className="spacer spacer--small" />
      )}
    </>
  );
}

function mapStateToProps(
  state: State,
  props: RouteComponentProps<{ id: string }>
): Props {
  const slug = props.match.params.id;
  const db = new DB(state);
  const locations = db.context('local').table('locations');
  const location = locations.where({ slug })[0];
  const relatedLocations = location
    ? db
        .table('locations')
        .where({ city: location.name })
        .filter(e => e.id !== location.id)
    : [];
  const events = location
    ? db
        .table('events')
        .where({ locationId: location.id })
        .map(e => ({
          ...e,
          location: db.table('locations').find(e.locationId)!,
        }))
        .filter(e => e.location)
    : [];
  return {
    location,
    relatedLocations,
    events,
  };
}

// export default withRouter(connect(mapStateToProps)(LocationPage));
