import { REACT_APP_GOOGLE_MAPS_API_KEY } from '@env';

// DO NOT hardcode API keys in source. Read from environment at runtime.
export const GOOGLE_MAPS_API_KEY = REACT_APP_GOOGLE_MAPS_API_KEY || '';

if (!GOOGLE_MAPS_API_KEY) {
	console.warn('Warning: GOOGLE_MAPS_API_KEY is not set. Maps and Places features will fail.');
}
