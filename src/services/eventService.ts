import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getToken } from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export interface Event {
  _id: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  city: string;
  category: string;
  date: string;
  time: string;
  isFree: boolean;
  price: string;
  imageUrl: string;
  galleryImages: string[];
  openingHours: { day: string; hours: string }[];
  isFeatured: boolean;
  isActive?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  tags: string[];
  latitude: number | null;
  longitude: number | null;
  distanceKm?: number;
  createdAt: string;
}

// Get all events — optional filters: category, isFeatured, search, limit
export const fetchEvents = async (params?: {
  category?: string;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
  mine?: boolean;
  includeAll?: boolean;
}): Promise<Event[]> => {
  const response = await api.get(`/events`, { params });
  return response.data.events;
};

// Get single event by ID
export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data.event;
};

export const fetchMyEvents = async (): Promise<Event[]> => {
  const response = await api.get(`/events/mine`);
  return response.data.events;
};

export const createEvent = async (payload: Partial<Event>): Promise<Event> => {
  const response = await api.post(`/events`, payload);
  return response.data.event;
};

export const approveEvent = async (id: string): Promise<Event> => {
  const response = await api.patch(`/events/${id}/approve`, {});
  return response.data.event;
};

export const rejectEvent = async (id: string): Promise<Event> => {
  const response = await api.patch(`/events/${id}/reject`, {});
  return response.data.event;
};

// Get nearby events; optionally sort/filter by user coordinates.
export const fetchNearbyEvents = async (
  userLat?: number,
  userLng?: number,
  radiusKm: number = 50,
  city?: string,
): Promise<Event[]> => {
  const params: Record<string, any> = {};
  if (userLat !== undefined && userLng !== undefined) {
    params.lat = userLat;
    params.lng = userLng;
    params.radiusKm = radiusKm;
  }
  if (city) {
    params.city = city;
  }
  const response = await api.get(`/events/nearby`, { params });
  return response.data.events;
};
