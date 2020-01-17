import { APISession } from '../api';
import { useData } from './data';

export function isLoggedIn(session?: APISession): boolean {
  return !!session && (session.level === 'user' || session.level === 'admin');
}

export function useSession(): APISession | undefined {
  const session = useData(db => db.get('session'));
  return session;
}
