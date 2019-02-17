import React from 'react';
import ReactDOM from 'react-dom';
import Application from './pages/application';
import { Provider } from 'react-redux';
import { store } from './state';
import { syncer } from './api-syncer';

import './registerServiceworker';

import './style.scss';
import { loadLocales } from './models/locales';

loadLocales();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className +=
    'ontouchstart' in document.documentElement ? ' touch' : ' no-touch';
  ReactDOM.render(
    <Provider store={store}>
      <Application />
    </Provider>,
    document.body.appendChild(document.createElement('div'))
  );
  syncer.refresh();
});
