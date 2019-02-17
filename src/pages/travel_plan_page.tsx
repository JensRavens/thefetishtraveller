import React from 'react';
import { connect } from 'react-redux';

import { DB, State } from '../state';
import { EventWithLocation, joinLocation } from '../models/event';
import Container from '../components/container';
import Hero from '../components/hero';
import { Calendar } from '../components/calendar';
import { TravelPlan } from '../models/travel_plan';
import { syncer } from '../api-syncer';

interface Props {
  id: string;
  plan?: TravelPlan;
  events: EventWithLocation[];
}

const mapStateToProps: (state: State, props: any) => Props = (state, props) => {
  const id = props.match.params.id;
  const db = new DB(state);
  const plan = db.table('travelPlans').find(id);
  const eventIds = (plan && plan.eventIds) || [];
  return {
    id,
    events: joinLocation(
      db
        .table('events')
        .where(e => eventIds.includes(e.id))
        .sort((a, b) => (a.startAt as any) - (b.startAt as any)),
      state
    ),
    plan,
  };
};

class TravelPlans extends React.Component<Props> {
  public componentDidMount() {
    syncer.loadTravelPlan(this.props.id);
  }

  public render() {
    const { events, plan } = this.props;
    return (
      <React.Fragment>
        <Hero>
          <Container>
            <h1>{plan && plan.name}</h1>
          </Container>
        </Hero>
        <Calendar events={events} />
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(TravelPlans);
