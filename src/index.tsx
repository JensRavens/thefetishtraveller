import Application from './pages/application';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state';
import { syncer } from './api-syncer';
import { client } from './models/apollo';
import { ApolloProvider } from '@apollo/client';

import './registerServiceworker';

import './style.scss';
import { loadLocales } from './models/locales';

loadLocales();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className +=
    'ontouchstart' in document.documentElement ? ' touch' : ' no-touch';
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Application />
      </Provider>
    </ApolloProvider>,
    document.body.appendChild(document.createElement('div'))
  );
  syncer.refresh();
});
