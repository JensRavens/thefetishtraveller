import '@hotwired/turbo-rails';
import '@rails/actiontext';
import { registerServiceWorker } from '@nerdgeschoss/shimmer';

registerServiceWorker();

import './sprinkles/trix';
import './controllers';
