import { camelCase, snakeCase, some, values } from 'lodash';
import { Image } from './models/image';
import { TravelPlan } from './models/travel_plan';

export interface APILocation {
  id: string;
  slug: string;
  name: string;
  address?: string;
  lat?: number;
  lon?: number;
  countryCode: string;
  city?: string;
  zip?: string;
  category: any;
  timezone?: string;
}

export interface APIEvent {
  id: string;
  eventId?: string;
  series?: string;
  slug: string;
  name: string;
  endAt: Date;
  startAt: Date;
  locationSlug: string;
  abstract?: string;
  description?: string;
  website?: string;
  ticketLink?: string;
  organizerName?: string;
  hero?: Image;
  header?: Image;
  logo?: Image;
  flyer?: Image;
  categories?: string[];
  fullDay: boolean;
}

export interface APILike {
  id: string;
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
  public sessionID?: string;
  private baseUrl: string;

  constructor(baseUrl: string, sessionID?: string) {
    this.baseUrl = baseUrl;
    this.sessionID = sessionID;
  }

  public async getEvents(): Promise<APIEvent[]> {
    return await this.get('/events');
  }

  public async getEvent(id: string): Promise<APIEvent> {
    return await this.get(`/events/${id}`);
  }

  public async updateEvent(id: string, event: Partial<APIEvent>) {
    return await this.patch(`/events/${id}`, event);
  }

  public async createEvent(event: { id: string } & Partial<APIEvent>) {
    return await this.post('/events', event);
  }

  public async like(eventID: string) {
    await this.post(`/events/${eventID}/likes`);
  }

  public async getLikes(): Promise<APILike[]> {
    return await this.get('/likes');
  }

  public async unlike(eventID: string) {
    await this.delete(`/events/${eventID}/likes`);
  }

  public async getLocations(): Promise<APILocation[]> {
    return await this.get('/locations');
  }

  public async getLocation(id: string): Promise<APILocation> {
    return await this.get(`/locations/${id}`);
  }

  public async updateLocation(
    location: { id: string } & Partial<APILocation>
  ): Promise<APILocation> {
    return await this.patch(`/locations/${location.id}`, location);
  }

  public async createLocation(location: { id: string } & Partial<APILocation>) {
    return await this.post('/locations', location);
  }

  public async getTravelPlan(id: string): Promise<TravelPlan> {
    return await this.get(`/travel_plans/${id}`);
  }

  public async createSession(): Promise<APISession> {
    const session = await this.post('/session');
    this.sessionID = session.id;
    return session;
  }

  public async login(email: string, password: string): Promise<APISession> {
    return await this.patch('/session', { email, password });
  }

  public async facebookLogin(facebookToken: string): Promise<APISession> {
    return await this.patch('/session', { facebookToken });
  }

  public async getSession(): Promise<APISession> {
    return await this.get('/session');
  }

  private async get(
    path: string,
    params?: { [key: string]: any }
  ): Promise<any> {
    return await this.load('GET', path, params);
  }

  private async post(
    path: string,
    params?: { [key: string]: any }
  ): Promise<any> {
    return await this.load('POST', path, params);
  }

  private async delete(
    path: string,
    params?: { [key: string]: any }
  ): Promise<any> {
    return await this.load('DELETE', path, params);
  }

  private async patch(
    path: string,
    params?: { [key: string]: any }
  ): Promise<any> {
    return await this.load('PATCH', path, params);
  }

  private async load(
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
    path: string,
    params?: { [key: string]: any }
  ): Promise<{ [key: string]: any }> {
    let containsFormData = false;
    if (params && some(values(params), e => e instanceof Blob)) {
      containsFormData = true;
    }
    const headers = {
      Accept: 'application/json',
    };
    if (!containsFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.sessionID) {
      headers['Authorization'] = `Bearer ${this.sessionID}`;
    }
    let body;
    let pathParams = '';
    if (method === 'GET') {
      if (params) {
        pathParams =
          '?' +
          Object.keys(params)
            .map(key => [key, params[key]].join('='))
            .join('&');
      }
    } else {
      if (params && containsFormData) {
        const form = new FormData();
        const convertedParams = this.kebabify(params);
        Object.keys(convertedParams).forEach(key => {
          form.append(key, convertedParams[key]);
        });
        body = form;
      } else {
        body = JSON.stringify(this.kebabify(params));
      }
    }
    const response = await fetch(this.baseUrl + path + pathParams, {
      headers,
      method,
      body,
    });
    if (response.status !== 200) {
      throw new Error('API Error');
    }
    const data = await response.json();
    return this.camelCasify(data);
  }

  private camelCasify(subject: any): any {
    if (subject instanceof Array) {
      return subject.map(e => this.camelCasify(e));
    }
    if (subject instanceof Object) {
      const transformed = {};
      Object.keys(subject).forEach(key => {
        let value = subject[key];
        if (typeof value === 'string' && key.endsWith('_at')) {
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

  private kebabify(subject: any): any {
    if (subject instanceof Array) {
      return subject.map(e => this.kebabify(e));
    }
    if (subject instanceof Object) {
      const transformed = {};
      Object.keys(subject).forEach(key => {
        const value = subject[key];
        transformed[snakeCase(key).replace('_file', '')] = this.convert(value);
      });
      return transformed;
    }
    return subject;
  }

  private convert(value: string | Date | File): string | Blob {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof File) {
      return value;
    }
    return this.kebabify(value);
  }
}
