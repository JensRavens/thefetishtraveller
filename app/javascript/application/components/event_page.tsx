import * as React from 'react';
import {connect} from 'react-redux';
import {Event, loadEvent} from '../models/event';
import {DB} from '../state';
import Container from './container';

interface Props {
  id: string;
  event?: Event;
}

class EventPage extends React.Component<Props> {
  componentDidMount() {
    if(!this.props.event) {
      console.log('loading event');
      loadEvent(this.props.id);
    }
  }

  render() {
    let {event} = this.props;
    if(!event) { return null };
    return (
      <Container>
        <div>Details about {event.name}.</div>
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  return {event: new DB(state).table('events').find(id), id};
}

export default connect(mapStateToProps)(EventPage)