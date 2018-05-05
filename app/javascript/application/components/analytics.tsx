import * as React from 'react';
import {Route} from 'react-router';

declare const window: Window & { ga?: (...args: string[]) => void }

export class Analytics extends React.Component {
  render() {
    return (
      <Route path="/" render={({location}) => {
        console.log(location);
        if (typeof window.ga === 'function') {
          window.ga('set', 'page', location.pathname + location.search);
          window.ga('send', 'pageview');
        }
        return null;
      }} />
    )
  }
}
