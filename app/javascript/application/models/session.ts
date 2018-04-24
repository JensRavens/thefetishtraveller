import {APISession} from '../api';

export function isLoggedIn(session: APISession | null) {
  return session && (session.level == 'user' || session.level == 'admin');
}
