import {APISession} from '../api';

export function isLoggedIn(session?: APISession): boolean {
  return !!session && (session.level == 'user' || session.level == 'admin');
}
