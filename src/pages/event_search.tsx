import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { scoped } from '@nerdgeschoss/i18n';
import { months, inMonth, matchesTerm, isCurrent } from '../models/event';
import { EventListing } from '../components/event_listing';
import { Meta } from '../components/meta';
import Container from '../components/container';
import Hero from '../components/hero';
import Listing from '../components/listing';
import FilterBar from '../components/filter-bar';
import { Form } from '../components/form';
import { TextInput } from '../components/input/text-input';
import { gql, useQuery } from '@apollo/client';
import { NextEventsQuery } from '../generated/NextEventsQuery';
import { compact } from 'lodash';

const t = scoped('event');

const DATA = gql`
  query EventSearchQuery {
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
`;

export default function EventSearch() {
  const { data, error } = useQuery<NextEventsQuery>(DATA);
  if (error) {
    console.error(error);
  }
  let events = (data && compact(data.events.nodes)) || [];
  const [currentMonth, setCurrentMonth] = useState<string | undefined>();
  const [term, setTerm] = useState<string | undefined>();
  const options = months(events.filter(isCurrent));
  const selectedMonth = options.filter(e => e.name === currentMonth)[0];
  if (selectedMonth) {
    events = events.filter(e => inMonth(e, selectedMonth));
  }
  if (term && term.length) {
    events = events.filter(e => matchesTerm(e, term));
  } else {
    events = events.filter(isCurrent);
  }
  return (
    <React.Fragment>
      <Meta title={t('menu.events')} />
      <Hero>
        <Container>
          <h1>{t('menu.events')}</h1>
          <div className="hero__addon">
            <Form model={{ term }} onInput={value => setTerm(value.term)}>
              <TextInput
                name="term"
                type="search"
                placeholder={t('.search_place_holder')}
              />
            </Form>
            <div
              className="text-center"
              dangerouslySetInnerHTML={{
                __html: t('.subscribe', {
                  link: `<a class="link" href="webcal://thefetishtraveller.com/feed/events.ics">${t(
                    '.subscribeHere'
                  )}</a>`,
                }),
              }}
            />
          </div>
          <Link to="/events/submit" className="hero__cta">
            {t('.submit_here')}
          </Link>
        </Container>
      </Hero>
      <FilterBar
        options={[t('.all')].concat(options.map(e => e.name))}
        selectedOption={currentMonth || 'all'}
        onChange={option => setCurrentMonth(option)}
      />
      <Listing>
        {events.map(e => (
          <EventListing key={e.id} event={e} liked={e.liked} />
        ))}
        <Link to="/events/submit" className="event-listing">
          <div className="event-listing__background" />
          <div className="event-listing__content">
            <div className="event-listing__category" />
            <div className="event-listing__name">{t('.event_missing')}</div>
            <div className="event-listing__description">
              {t('.submit_here')}
            </div>
            <div className="event-listing__details" />
          </div>
        </Link>
      </Listing>
    </React.Fragment>
  );
}
