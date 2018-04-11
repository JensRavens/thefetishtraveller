export interface APIEvent {
  name: string;
}

export class API {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getEvents(): Promise<APIEvent[]> {
    return await this.get('/events');
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
    return await response.json();
  }
}

export const api = new API('/api/v1');
