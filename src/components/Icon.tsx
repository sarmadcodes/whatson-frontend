import React from 'react';
import {
  HomeIcon,
  MapIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  BackIcon,
  CheckIcon,
  FilterIcon,
  CloseIcon,
  MenuIcon,
  SettingsIcon,
  LogoutIcon,
  HeartIcon,
  CameraIcon,
  ImageIcon,
  LoadingIcon,
  StarIcon,
  BellIcon,
  PinIcon,
  ChevronBackIcon,
  ChevronForwardIcon,
  CalendarIcon,
  ShareIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  TrendingUpIcon,
  NavigateIcon,
  ComedyIcon,
  MusicIcon,
  DjIcon,
  FoodIcon,
  ClubIcon,
} from './SvgIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const iconMap: Record<string, React.FC<any>> = {
  // Common names
  home: HomeIcon,
  'home-outline': HomeIcon,
  map: MapIcon,
  'map-outline': MapIcon,
  add: PlusIcon,
  'add-outline': PlusIcon,
  search: SearchIcon,
  'search-outline': SearchIcon,
  person: UserIcon,
  'person-outline': UserIcon,
  'arrow-back': BackIcon,
  'chevron-back': ChevronBackIcon,
  'chevron-forward': ChevronForwardIcon,
  'chevron-up': ChevronBackIcon,
  'chevron-down': ChevronForwardIcon,
  checkmark: CheckIcon,
  close: CloseIcon,
  'close-circle': CloseIcon,
  menu: MenuIcon,
  settings: SettingsIcon,
  'settings-outline': SettingsIcon,
  logout: LogoutIcon,
  heart: HeartIcon,
  'heart-outline': HeartIcon,
  camera: CameraIcon,
  'camera-outline': CameraIcon,
  image: ImageIcon,
  star: StarIcon,
  'star-outline': StarIcon,
  notifications: BellIcon,
  'notifications-outline': BellIcon,
  'pin-sharp': PinIcon,
  'calendar-outline': CalendarIcon,
  'share-social': ShareIcon,
  'share-social-outline': ShareIcon,
  'eye-outline': EyeOffIcon,
  eye: EyeIcon,
  'cloud-upload-outline': UploadIcon,
  'trending-up': TrendingUpIcon,
  navigate: NavigateIcon,
  'happy-outline': ComedyIcon,
  'happy': ComedyIcon,
  music: MusicIcon,
  'musical-notes-outline': MusicIcon,
  dj: DjIcon,
  nightlife: DjIcon,
  food: FoodIcon,
  restaurant: FoodIcon,
  clubs: ClubIcon,
  club: ClubIcon,
  people: UserIcon,
  'people-outline': UserIcon,
  'headset-outline': DjIcon,
  'sparkles-outline': StarIcon,
  'restaurant-outline': FoodIcon,
  'location-outline': PinIcon,
  location: PinIcon,
  'ticket-outline': CalendarIcon,
  'cash-outline': TrendingUpIcon,
  storefront: HomeIcon,
  assignment: MenuIcon,
  visibility: EyeIcon,
  'book-outline': MenuIcon,
  'mail-outline': BellIcon,
  'options-outline': MenuIcon,
  'help-outline': SettingsIcon,
  'share-sharp': ShareIcon,
  'log-out-outline': LogoutIcon,
  'menu-outline': MenuIcon,
  'pencil': MenuIcon,
  'tv-sharp': MenuIcon,
  'ellipsis-horizontal': MenuIcon,
};

export const Icon = ({ name, size = 24, color = '#ffffff', style }: IconProps) => {
  const IconComponent = iconMap[name.toLowerCase()];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return <MenuIcon size={size} color={color} />;
  }
  
  return <IconComponent size={size} color={color} filled={name.includes('outline') ? false : true} />;
};

export default Icon;
