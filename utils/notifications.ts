import Constants from 'expo-constants';

import type { Schedule } from '@/types';

interface NotificationHandlerResult {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
  shouldShowBanner: boolean;
  shouldShowList: boolean;
}

interface NotificationHandler {
  handleNotification: () => Promise<NotificationHandlerResult>;
}

type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

interface ScheduleNotificationInput {
  content: {
    title: string;
    body: string;
    data: {
      scheduleId: string;
    };
  };
  trigger: {
    type: string;
    date: Date;
  };
}

interface NotificationsModule {
  setNotificationHandler: (handler: NotificationHandler) => void;
  getPermissionsAsync: () => Promise<{ status: NotificationPermissionStatus }>;
  requestPermissionsAsync: () => Promise<{ status: NotificationPermissionStatus }>;
  scheduleNotificationAsync: (input: ScheduleNotificationInput) => Promise<string>;
  cancelScheduledNotificationAsync: (notificationId: string) => Promise<void>;
  cancelAllScheduledNotificationsAsync: () => Promise<void>;
  SchedulableTriggerInputTypes: {
    DATE: string;
  };
}

let cachedNotifications: NotificationsModule | null = null;
let handlerInitialized = false;

const isExpoGo = Constants.appOwnership === 'expo';

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (isExpoGo) {
    return null;
  }

  if (cachedNotifications) {
    return cachedNotifications;
  }

  try {
    const module = (await import('expo-notifications')) as unknown as NotificationsModule;
    cachedNotifications = module;
    return module;
  } catch (error) {
    console.warn('expo-notifications 모듈을 불러오지 못했습니다:', error);
    return null;
  }
}

async function ensureNotificationHandler(): Promise<void> {
  if (handlerInitialized) {
    return;
  }

  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  handlerInitialized = true;
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      console.warn('Expo Go에서는 알림 기능을 사용할 수 없습니다.');
      return false;
    }

    await ensureNotificationHandler();
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
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      console.warn('Expo Go에서는 알림 기능을 사용할 수 없습니다.');
      return null;
    }

    await ensureNotificationHandler();
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
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return;
    }

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
