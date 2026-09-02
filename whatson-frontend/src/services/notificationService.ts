import notifee, { AndroidImportance } from '@notifee/react-native';

export const showLocalNotification = async (title: string, body: string) => {
  const channelId = await notifee.createChannel({
    id: 'whatson_default',
    name: 'WhatsOn Notifications',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title,
    body,
    android: { channelId, pressAction: { id: 'default' } },
  });
};