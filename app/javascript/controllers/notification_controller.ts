import { consumer } from 'lib/cable';
import { Controller } from 'stimulus';

export default class extends Controller {
  private subscription: any;

  connect(): void {
    this.subscription = consumer.subscriptions.create(
      {
        channel: 'NotificationChannel',
      },
      {
        received: async (data) => {
          if (data.unread_count) {
            (this.element as HTMLDivElement).dataset.count = data.unread_count;
          }
          if (data.title) {
            await Notification.requestPermission();
            new Notification(data.title, {
              body: data.body ?? undefined,
              icon: data.image,
            });
          }
        },
      }
    );
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }
}
