import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule, ScheduleInput } from '@/types';
import { STORAGE_KEYS } from '@/constants/Storage';
import { scheduleNotification, cancelNotification } from '@/utils/notifications';

interface ScheduleStore {
  schedules: Schedule[];
  
  addSchedule: (input: ScheduleInput) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<ScheduleInput>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
  clearAll: () => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedules: [],
      
      addSchedule: async (input: ScheduleInput) => {
        const now = new Date().toISOString();
        const newSchedule: Schedule = {
          ...input,
          id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        };

        if (input.notificationEnabled) {
          const notifId = await scheduleNotification(newSchedule);
          if (notifId) {
            newSchedule.notificationId = notifId;
          }
        }

        set((state) => ({
          schedules: [...state.schedules, newSchedule],
        }));
      },
      
      updateSchedule: async (id: string, updates: Partial<ScheduleInput>) => {
        const schedule = get().getScheduleById(id);
        if (!schedule) return;

        if (schedule.notificationId) {
          await cancelNotification(schedule.notificationId);
        }

        const updatedSchedule: Schedule = {
          ...schedule,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        if (updatedSchedule.notificationEnabled) {
          const notifId = await scheduleNotification(updatedSchedule);
          if (notifId) {
            updatedSchedule.notificationId = notifId;
          }
        } else {
          updatedSchedule.notificationId = undefined;
        }

        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? updatedSchedule : s
          ),
        }));
      },
      
      deleteSchedule: async (id: string) => {
        const schedule = get().getScheduleById(id);
        if (schedule?.notificationId) {
          await cancelNotification(schedule.notificationId);
        }

        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        }));
      },
      
      getScheduleById: (id: string) => {
        return get().schedules.find((s) => s.id === id);
      },
      
      clearAll: () => {
        set({ schedules: [] });
      },
    }),
    {
      name: STORAGE_KEYS.SCHEDULES,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
