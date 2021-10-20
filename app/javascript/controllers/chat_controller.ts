import { consumer } from 'lib/cable';
import { Controller } from 'stimulus';

export default class extends Controller {
  static values = { conversation: String };
  declare readonly conversationValue: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscription: any;

  connect(): void {
    this.subscription = consumer.subscriptions.create(
      {
        channel: 'ChatChannel',
        id: this.conversationValue,
      },
      {
        received: (data) => {
          this.element.insertAdjacentHTML('beforeend', data.html);
        },
      }
    );
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }
}
