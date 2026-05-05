import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getToken } from '../store/authStore';

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
  tags: string[];
  latitude: number | null;
  longitude: number | null;
  distanceKm?: number;
  createdAt: string;
}

const getAuthHeader = async () => {
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
};

// Get all events — optional filters: category, isFeatured, search, limit
export const fetchEvents = async (params?: {
  category?: string;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
}): Promise<Event[]> => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/events`, { headers, params });
  return response.data.events;
};

// Get single event by ID
export const fetchEventById = async (id: string): Promise<Event> => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}/events/${id}`, { headers });
  return response.data.event;
};

// Get nearby events; optionally sort/filter by user coordinates.
export const fetchNearbyEvents = async (
  userLat?: number,
  userLng?: number,
  radiusKm: number = 50,
): Promise<Event[]> => {
  const headers = await getAuthHeader();
  const params: Record<string, any> = {};
  if (userLat !== undefined && userLng !== undefined) {
    params.lat = userLat;
    params.lng = userLng;
    params.radiusKm = radiusKm;
  }
  const response = await axios.get(`${API_BASE_URL}/events/nearby`, { headers, params });
  return response.data.events;
};
