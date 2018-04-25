import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Application from './pages/application';
import {Provider} from 'react-redux';
import {store} from './state';
import {syncer} from './api-syncer';

require('./registerServiceworker');
require('./style');

syncer.refresh();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className += (("ontouchstart" in document.documentElement) ? ' touch' : ' no-touch');
  ReactDOM.render(
    <Provider store={store}>
      <Application/>
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})
