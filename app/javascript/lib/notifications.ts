import { consumer } from './cable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let subscription: any;

export function startNotifications(): void {
  subscription = consumer.subscriptions.create(
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

export function stopNotifications(): void {
  subscription.unsubscribe();
}
