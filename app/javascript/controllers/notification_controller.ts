import { Controller } from 'stimulus';
import { startNotifications } from 'lib/notifications';

export default class extends Controller {
  connect(): void {
    startNotifications();
  }
}
