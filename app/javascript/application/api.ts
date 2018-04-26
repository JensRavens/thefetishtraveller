import {camelCase, snakeCase, mapKeys} from 'lodash';
import {Image} from './models/image';

export interface APILocation {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lon?: number;
  countryCode: string;
  city?: string;
  zip?: string;
}

export interface APIEvent {
  id: string;
  name: string;
  endAt: Date;
  startAt: Date;
  location: APILocation;
  abstract?: string;
  description?: string;
  website?: string;
  ticketLink?: string;
  organizerName?: string;
  hero?: Image;
  logo?: Image;
  categories?: string[];
}

export interface APILike {
  eventId: string;
}

export interface APISession {
  id: string;
  userId: string;
  level: 'guest' | 'user' | 'admin';
  likedEventIds: string[];
  ownedEventIds: string[];
  ownedLocationIds: string[];
}

export class API {
  private baseUrl: string;
  sessionID?: string;

  constructor(baseUrl: string, sessionID?: string) {
    this.baseUrl = baseUrl;
    this.sessionID = sessionID;
  }

  async getEvents(): Promise<APIEvent[]> {
    return await this.get('/events');
  }

  async getEvent(id: string): Promise<APIEvent> {
    return await this.get(`/events/${id}`);
  }

  async updateEvent(event: {id: string} & Partial<APIEvent>) {
    return await this.patch(`/events/${event.id}`, event);
  }

  async createEvent(event: {id: string} & Partial<APIEvent>) {
    return await this.post('/events', event);
  }

  async like(eventID: string) {
    await this.post(`/events/${eventID}/likes`);
  }

  async getLikes(): Promise<APILike[]> {
    return await this.get('/likes');
  }

  async unlike(eventID: string) {
    await this.delete(`/events/${eventID}/likes`);
  }

  async getLocations(): Promise<APILocation[]> {
    return await this.get('/locations');
  }

  async getLocation(id: string): Promise<APILocation> {
    return await this.get(`/locations/${id}`);
  }

  async updateLocation(location: {id: string} & Partial<APILocation>) {
    return await this.patch(`/locations/${location.id}`, location);
  }

  async createLocation(location: {id: string} & Partial<APILocation>) {
    return await this.post('/locations', location);
  }

  async createSession(): Promise<APISession> {
    const session = await this.post('/session');
    this.sessionID = session.id;
    return session;
  }

  async login(email, password): Promise<APISession> {
    return await this.patch('/session', {email, password});
  }

  async getSession(): Promise<APISession> {
    return await this.get('/session');
  }

  private async get(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('GET', path, params);
  }

  private async post(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('POST', path, params);
  }

  private async delete(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('DELETE', path, params);
  }

  private async patch(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('PATCH', path, params);
  }

  private async load(method: 'GET' | 'POST' | 'DELETE' | 'PATCH', path: string, params?: {[key: string]: any}): Promise<{[key: string]: any}> {
    const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
    if(this.sessionID) {
      headers['Authorization'] = `Bearer ${this.sessionID}`;
    }
    let body;
    let pathParams = '';
    if (method === 'GET') {
      if (params) {
        pathParams = '?' + Object.keys(params).map(key => [key, params[key]].join('=')).join('&')
      }
    } else {
      body = JSON.stringify(this.kebabify(params));
    }
    const response = await fetch(this.baseUrl + path + pathParams, {headers, method, body });
    if(response.status !== 200) {
      throw "API Error"
    }
    const data = await response.json();
    return this.camelCasify(data);
  }

  private camelCasify(subject) {
    if(subject instanceof Array) {
      return subject.map(e => this.camelCasify(e));
    }
    if(subject instanceof Object) {
      const transformed = {};
      Object.keys(subject).forEach(key => {
        let value = subject[key];
        if(typeof value === 'string' && key.endsWith('_at')) {
          value = new Date(value);
        } else {
          value = this.camelCasify(value);
        }
        transformed[camelCase(key)] = value;
      });
      return transformed;
    }
    return subject;
  }

  private kebabify(subject) {
    if(subject instanceof Array) {
      return subject.map(e => this.kebabify(e));
    }
    if(subject instanceof Object) {
      const transformed = {};
      Object.keys(subject).forEach(key => {
        let value = subject[key];
        transformed[snakeCase(key)] = this.kebabify(value);
      });
      return transformed;
    }
    return subject;
  }
}
