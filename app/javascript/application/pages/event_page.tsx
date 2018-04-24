import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EventWithLocation, canEdit, joinLocation} from '../models/event';
import {DB, DBAction, writeDB, State} from '../state';
import {APISession} from '../api';
import Container from '../components/container';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: EventWithLocation;
  liked: boolean;
  editable: boolean;
  dispatch: (DBAction) => void;
}

const likes = writeDB.table('likes');

class EventPage extends React.Component<Props> {
  like() {
    this.props.dispatch(likes.insert({eventId: this.props.id}));
  }

  unlike() {

  }

  render() {
    let {event, liked, editable} = this.props;
    if(!event) { return null };
    return (
      <Container>
        <h1>{event.name} <small>{dateRange(event.startAt, event.endAt)}</small></h1>
        <p>{event.location.city}, {event.location.countryCode}</p>
        <div>{liked ? <span onClick={() => this.unlike()}>💔</span> : <span onClick={() => this.like()}>❤️</span> }</div>
        {editable && <div><Link to={`/events/${event.id}/edit`}>edit</Link></div>}
      </Container>
    )
  }
}

const mapStateToProps = (state: State, props) => {
  const id: string = props.match.params.id;
  const db = new DB(state);
  let event: EventWithLocation | null = joinLocation([id], state)[0];
  const editable = canEdit(event, db.get('session'));
  const liked = db.table('likes').where({eventId: id}).length > 0;
  return {event, id, liked, editable};
}

export default connect(mapStateToProps)(EventPage)
