import {camelCase, mapKeys} from 'lodash';

export interface APIEvent {
  id: string;
  name: string;
  endAt: Date;
  startAt: Date;
  countryCode: string;
  city: string;
}

export class API {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getEvents(): Promise<APIEvent[]> {
    return await this.get('/events');
  }

  async getEvent(id: string): Promise<APIEvent> {
    return await this.get(`/events/${id}`);
  }

  private async get(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('GET', path, params);
  }

  private async post(path: string, params?: {[key: string]: any}): Promise<any> {
    return await this.load('POST', path, params);
  }

  private async load(method: 'GET' | 'POST', path: string, params?: {[key: string]: any}): Promise<{[key: string]: any}> {
    const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
    let body;
    let pathParams = '';
    if (method === 'GET') {
      if (params) {
        pathParams = '?' + Object.keys(params).map(key => [key, params[key]].join('=')).join('&')
      }
    } else {
      body = JSON.stringify(params);
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
}

export const api = new API('/api/v1');
