import React from 'react';
import { Link } from 'react-router-dom';

import { DB, State } from '../state';
import {
  EventWithLocation,
  joinLocation,
  chronological,
  isCurrent,
} from '../models/event';
import { Like } from '../models/like';

import { EventListing } from '../components/event_listing';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import { Signup } from '../components/signup';
import { Meta } from '../components/meta';
import { scoped } from '@nerdgeschoss/i18n';
import { gql, useQuery } from '@apollo/client';

import backgroundImage from '../assets/background.jpg';
import { NextEventsQuery } from '../generated/NextEventsQuery';

const t = scoped('home');

const NEXT_EVENTS = gql`
  query NextEventsQuery {
    events(first: 6) {
      nodes {
        id
        name
        slug
        categories
        liked
        startAt
        endAt
        fullDay
        location {
          id
          name
          city
          countryCode
        }
      }
    }
  }
`;

export default function Home(): JSX.Element {
  const { data, error } = useQuery<NextEventsQuery>(NEXT_EVENTS);
  if (error) {
    console.log(error);
  }
  return (
    <React.Fragment>
      <Meta title={null} />
      <Hero backgroundImage={backgroundImage} style="expanded">
        <Container>
          <h1 className="with-dash">{t('.claim')}</h1>
          <div className="hero__addon">
            <h5>{t('.intro')}</h5>
            <div className="spacer spacer--tiny" />
            <p className="text-center">
              <Link to="/events" className="button">
                {t('.explore_events_now')}
              </Link>
            </p>
          </div>
        </Container>
      </Hero>
      <div className="spacer" />
      <h2>{t('.next_up')}</h2>
      <Listing singleLine={true}>
        {data &&
          data.events.nodes!.map(e => (
            <EventListing key={e.id} event={e as any} liked={e.liked} />
          ))}
      </Listing>
      <div className="button-line button-line--dark">
        <Link to="/events" className="button">
          {t('.find_more_events')}
        </Link>
      </div>
      <Signup />
    </React.Fragment>
  );
}
