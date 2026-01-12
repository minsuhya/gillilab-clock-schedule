import * as Notifications from 'expo-notifications';
import { Schedule } from '@/types';
import { timeToMinutes } from './timeUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

export async function scheduleNotification(schedule: Schedule): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return null;
    }

    const [hours, minutes] = schedule.startTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${schedule.category} 일정 시작`,
        body: `${schedule.title}\n${schedule.startTime} - ${schedule.endTime}`,
        data: { scheduleId: schedule.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledTime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}

export async function rescheduleAll(schedules: Schedule[]): Promise<void> {
  await cancelAllNotifications();
  
  for (const schedule of schedules) {
    if (schedule.notificationEnabled) {
      await scheduleNotification(schedule);
    }
  }
}
