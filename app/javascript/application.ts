import * as Rails from '@rails/ujs';
import '@hotwired/turbo-rails';
import 'form-request-submit-polyfill';
import '@rails/actiontext';

Rails.start();

import './sprinkles/touch';
import './sprinkles/trix';
import './controllers';
