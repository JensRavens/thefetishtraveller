import '@hotwired/turbo-rails';
import '@rails/actiontext';
import { registerServiceWorker } from 'lib/serviceworker';

registerServiceWorker();

import './sprinkles/touch';
import './sprinkles/trix';
import './controllers';
