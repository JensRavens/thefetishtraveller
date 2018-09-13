import * as React from 'react';
import { connect } from 'react-redux';

import { DB, State } from '../state';
import { EventWithLocation, joinLocation } from '../models/event';
import Container from '../components/container';
import Hero from '../components/hero';
import { Calendar } from '../components/calendar';
import { scoped } from '../i18n';
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
  console.log({ id });
  const plan = db.table('travelPlans').find(id);
  const eventIds = (plan && plan.eventIds) || [];
  console.log(eventIds);
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

const t = scoped('travel_plan');

class TravelPlans extends React.Component<Props> {
  componentDidMount() {
    syncer.loadTravelPlan(this.props.id);
  }

  render() {
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
