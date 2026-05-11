import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const HomeIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

export const MapIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" fill={color} />
  </Svg>
);

export const PlusIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={color}>
    <Line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
    <Line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
  </Svg>
);

export const SearchIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Circle cx="11" cy="11" r="8" />
    <Path d="m21 21-4.35-4.35" strokeLinecap="round" />
  </Svg>
);

export const UserIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const BackIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CheckIcon = ({ size = 24, color = '#008E6D' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={3} stroke={color}>
    <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const FilterIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </Svg>
);

export const CloseIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={color}>
    <Line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
    <Line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
  </Svg>
);

export const MenuIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <Line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <Line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24" />
  </Svg>
);

export const LogoutIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
  </Svg>
);

export const HeartIcon = ({ size = 24, color = '#ffffff', filled = false }: IconProps & { filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} strokeWidth={2} stroke={color}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

export const CameraIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

export const ImageIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);

export const LoadingIcon = ({ size = 24, color = '#008E6D' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Circle cx="12" cy="12" r="10" strokeOpacity={0.3} />
    <Path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </Svg>
);

export const StarIcon = ({ size = 24, color = '#FFB800', filled = false }: IconProps & { filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} strokeWidth={2} stroke={color}>
    <Polygon points="12 2 15.09 10.26 23.77 10.36 17.94 16.02 19.89 24 12 18.82 4.11 24 6.06 16.02 0.23 10.36 8.91 10.26" />
  </Svg>
);

export const BellIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const PinIcon = ({ size = 24, color = '#FF0000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} strokeWidth={0}>
    <Path d="M12 2C6.48 2 2 6.48 2 12c0 6 10 12 10 12s10-6 10-12c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </Svg>
);

export const ChevronBackIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={color}>
    <Polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronForwardIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={color}>
    <Polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CalendarIcon = ({ size = 24, color = '#cccccc' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke={color}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Line x1="9" y1="2" x2="9" y2="6" />
    <Line x1="15" y1="2" x2="15" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

export const ShareIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

export const EyeIcon = ({ size = 24, color = '#666666' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export const EyeOffIcon = ({ size = 24, color = '#666666' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <Line x1="1" y1="1" x2="23" y2="23" />
  </Svg>
);

export const UploadIcon = ({ size = 24, color = '#008E6D' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="17 8 12 3 7 8" />
    <Line x1="12" y1="3" x2="12" y2="15" />
  </Svg>
);

export const TrendingUpIcon = ({ size = 24, color = '#008E6D' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <Polyline points="17 6 23 6 23 12" />
  </Svg>
);

export const NavigateIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} strokeWidth={0}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.07 5.07l-7.07 7.07-2.83-2.83-2.83 2.83L12 7.93l7.07-7.07 2.83 2.83 2.83-2.83z" />
  </Svg>
);

export const ComedyIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke={color}>
    <Circle cx="12" cy="12" r="9" />
    <Circle cx="9" cy="10" r="1" fill={color} stroke="none" />
    <Circle cx="15" cy="10" r="1" fill={color} stroke="none" />
    <Path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" strokeLinecap="round" />
  </Svg>
);

export const MusicIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="6" cy="18" r="3" />
    <Circle cx="18" cy="16" r="3" />
  </Svg>
);

export const DjIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Rect x="3" y="6" width="18" height="12" rx="3" />
    <Circle cx="9" cy="12" r="2.5" />
    <Circle cx="15" cy="12" r="2.5" />
    <Line x1="9" y1="12" x2="15" y2="12" />
  </Svg>
);

export const FoodIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Path d="M4 3v8" strokeLinecap="round" />
    <Path d="M7 3v8" strokeLinecap="round" />
    <Path d="M5.5 3v18" strokeLinecap="round" />
    <Path d="M14 3v9a2 2 0 0 0 2 2h1v6" strokeLinecap="round" />
    <Path d="M18 3v20" strokeLinecap="round" />
  </Svg>
);

export const ClubIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={color}>
    <Circle cx="12" cy="12" r="8" />
    <Circle cx="12" cy="12" r="2" fill={color} stroke="none" />
    <Line x1="12" y1="4" x2="12" y2="6" strokeLinecap="round" />
    <Line x1="12" y1="18" x2="12" y2="20" strokeLinecap="round" />
    <Line x1="4" y1="12" x2="6" y2="12" strokeLinecap="round" />
    <Line x1="18" y1="12" x2="20" y2="12" strokeLinecap="round" />
  </Svg>
);
