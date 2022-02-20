import '@hotwired/turbo-rails';
import '@rails/actiontext';
import { registerServiceWorker, start } from '@nerdgeschoss/shimmer';
import { application } from 'controllers/application';
import './sprinkles/trix';
import './controllers';

start({ application });

registerServiceWorker();
