import { REACT_APP_API_BASE_URL } from '@env';

// If testing on a physical device, use your Wi-Fi IP (e.g., http://192.168.100.80:5000/api)
// If testing on an Android Emulator, use the special alias 10.0.2.2
const DEV_API_BASE_URL = 'http://192.168.100.80:5000/api';
// const DEV_API_BASE_URL = 'http://192.168.100.80:5000/api'; 

const PROD_API_BASE_URL = 'https://resumes-lover-recall-ext.trycloudflare.com/api';

export const API_BASE_URL = REACT_APP_API_BASE_URL || (__DEV__ ? DEV_API_BASE_URL : PROD_API_BASE_URL);