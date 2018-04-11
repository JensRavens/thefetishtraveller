import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Application from './components/application';
import {Provider} from 'react-redux';
import {store} from './state';


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Application/>
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})
