import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../services/eventService';

const SAVED_KEY = 'whatson_saved_events';

export const getSavedEvents = async (): Promise<Event[]> => {
  const data = await AsyncStorage.getItem(SAVED_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEvent = async (event: Event): Promise<void> => {
  const current = await getSavedEvents();
  const alreadySaved = current.find(e => e._id === event._id);
  if (alreadySaved) return;
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...current, event]));
};

export const unsaveEvent = async (eventId: string): Promise<void> => {
  const current = await getSavedEvents();
  const updated = current.filter(e => e._id !== eventId);
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
};

export const isEventSaved = async (eventId: string): Promise<boolean> => {
  const current = await getSavedEvents();
  return current.some(e => e._id === eventId);
};
