import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EventWithLocation, canEdit, joinLocation} from '../models/event';
import {Like} from '../models/like';
import {locationDescription} from '../models/location';
import {DB, DBAction, writeDB, State} from '../state';
import {APISession} from '../api';
import Container from '../components/container';
import Hero from '../components/hero';
import LikeButton from '../components/like-button';
import {dateRange} from '../util';

interface Props {
  id: string;
  event?: EventWithLocation;
  like?: Like;
  editable: boolean;
  dispatch: (DBAction) => void;
}

const likes = writeDB.table('likes');

class EventPage extends React.Component<Props> {
  like() {
    this.props.dispatch(likes.insert({eventId: this.props.id}));
  }

  unlike(like: Like) {
    this.props.dispatch(likes.delete(like));
  }

  render() {
    let {event, like, editable} = this.props;
    if(!event) { return null };
    return (
      <React.Fragment>
        <Hero backgroundImage={event.hero && event.hero.full}>
          <Container>
            <h1>{event.name}</h1>
          </Container>
        </Hero>
        <div className="spacer"/>
        <Container>
          <h4>{dateRange(event.startAt, event.endAt)} - {locationDescription(event.location)}</h4>
          <div className="text-center"><LikeButton active={!!like} onClick={() => !!like ? this.unlike(like) : this.like()}/></div>
          {editable && <div><Link to={`/events/${event.id}/edit`}>edit</Link></div>}
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: State, props) => {
  const id: string = props.match.params.id;
  const db = new DB(state);
  let event: EventWithLocation | null = joinLocation([id], state)[0];
  const editable = canEdit(event, db.get('session'));
  const like = db.table('likes').where({eventId: id})[0]
  return {event, id, like, editable};
}

export default connect(mapStateToProps)(EventPage)
