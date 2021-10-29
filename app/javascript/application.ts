import * as Rails from '@rails/ujs';
import '@hotwired/turbo-rails';
import 'form-request-submit-polyfill';

Rails.start();

import './sprinkles/touch';
import './controllers';
