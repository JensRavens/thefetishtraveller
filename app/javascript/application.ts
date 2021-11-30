import * as Rails from '@rails/ujs';
import '@hotwired/turbo-rails';
import 'form-request-submit-polyfill';
import Trix from 'trix';
import '@rails/actiontext';

Rails.start();

import './sprinkles/touch';
import './controllers';

Object.assign(window, { config: Trix.config });
Trix.config.blockAttributes.aside = {
  tagName: 'aside',
};

Trix.config.blockAttributes.heading1.tagName = 'h2';

addEventListener('trix-initialize', (event) => {
  const buttonHTML =
    '<button type="button" class="trix-button" data-trix-attribute="aside" title="Custom Section">CS</button>';
  const groupElement = event.target.toolbarElement.querySelector(
    '.trix-button-group--block-tools'
  );
  groupElement.insertAdjacentHTML('beforeend', buttonHTML);
});
