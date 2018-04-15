import * as React from 'react';
import {connect} from 'react-redux';
import {Event, loadEvent} from '../models/event';
import {DB} from '../state';
import Container from '../components/container';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: Event;
}

class EventPage extends React.Component<Props> {
  componentDidMount() {
    if(!this.props.event) {
      loadEvent(this.props.id);
    }
  }

  render() {
    let {event} = this.props;
    if(!event) { return null };
    return (
      <Container>
        <h1>{event.name} <small>{dateRange(event.startAt, event.endAt)}</small></h1>
        <p>{event.city}, {event.countryCode}</p>
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  return {event: new DB(state).table('events').find(id), id};
}

export default connect(mapStateToProps)(EventPage)