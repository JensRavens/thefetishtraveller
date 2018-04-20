import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Event, loadEvent, canEdit} from '../models/event';
import {like, unlike, refreshLikes} from '../models/like';
import {DB} from '../state';
import Container from '../components/container';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: Event;
  liked: boolean;
}

class EventPage extends React.Component<Props> {
  componentDidMount() {
    if(!this.props.event) {
      loadEvent(this.props.id);
    }
    refreshLikes();
  }

  like() {
    like(this.props.event!);
  }

  unlike() {
    unlike(this.props.event!);
  }

  render() {
    let {event, liked} = this.props;
    if(!event) { return null };
    return (
      <Container>
        <h1>{event.name} <small>{dateRange(event.startAt, event.endAt)}</small></h1>
        <p>{event.location.city}, {event.location.countryCode}</p>
        <div>{liked ? <span onClick={() => this.unlike()}>💔</span> : <span onClick={() => this.like()}>❤️</span> }</div>
        {canEdit(event) && <div><Link to={`/events/${event.id}/edit`}>edit</Link></div>}
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const id = props.match.params.id;
  const db = new DB(state);
  return {event: db.table('events').find(id), id, liked: db.table('likes').where({eventId: id}).length > 0};
}

export default connect(mapStateToProps)(EventPage)
