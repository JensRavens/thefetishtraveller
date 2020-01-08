import React from 'react';
import Container from '../components/container';
import Hero from '../components/hero';
import { Calendar } from '../components/calendar';
import { scoped } from '@nerdgeschoss/i18n';
import { gql, useQuery } from '@apollo/client';
import { compact } from 'lodash';
import {
  TravelPlansQuery,
  TravelPlansQueryVariables,
} from '../generated/TravelPlansQuery';
import { useParams } from 'react-router';
import { useSession } from '../models/session';

const t = scoped('calendar');

const DATA = gql`
  query TravelPlansQuery($id: ID!) {
    user(id: $id) {
      name
      events {
        nodes {
          id
          name
          slug
          categories
          liked
          startAt
          endAt
          fullDay
          hero {
            medium
          }
          location {
            id
            name
            city
            countryCode
          }
        }
      }
    }
  }
`;

export default function TravelPlans(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useQuery<TravelPlansQuery, TravelPlansQueryVariables>(
    DATA,
    {
      variables: { id },
    }
  );
  if (error) {
    console.log(error);
  }
  const session = useSession();
  const isMyPlan = session && session.userId === id;
  const events = data && data.user && compact(data.user.events.nodes);
  return (
    <>
      <Hero>
        <Container>
          <h1>
            {isMyPlan
              ? t('.heading')
              : (data && data.user && data.user.name) || t('.heading')}
          </h1>
          {events && events.length && (
            <div className="hero__addon text-center">
              <a
                className="button"
                href={`webcal://${location.host}/feed/events?user_id=${id}`}
              >
                {t('.subscribe')}
              </a>
            </div>
          )}
        </Container>
      </Hero>
      {events && <Calendar events={events} />}
    </>
  );
}
