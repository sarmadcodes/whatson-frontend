import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../services/eventService';

const SAVED_KEY = 'saved_events';

export const getSavedEvents = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(SAVED_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEvent = async (event: Event): Promise<void> => {
  const current = await getSavedEvents();
  if (current.includes(event._id)) return;
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...current, event._id]));
};

export const unsaveEvent = async (eventId: string): Promise<void> => {
  const current = await getSavedEvents();
  const updated = current.filter(id => id !== eventId);
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
};

export const isEventSaved = async (eventId: string): Promise<boolean> => {
  const current = await getSavedEvents();
  return current.includes(eventId);
};
