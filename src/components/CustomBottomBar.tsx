import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, MapIcon, PlusIcon, SearchIcon, UserIcon } from './SvgIcons';

const iconMap: Record<string, React.FC<{ size: number; color: string }>> = {
  Discover: HomeIcon,
  Maps: MapIcon,
  Browse: PlusIcon,
  Search: SearchIcon,
  Profile: UserIcon,
};

const CustomBottomBar = ({ state, navigation }: { state: any; navigation: any }) => {
  const insets = useSafeAreaInsets();

  const animations = useRef(
    state.routes.map((_: any, i: number) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    animations.forEach((anim: Animated.Value, i: number) => {
      Animated.timing(anim, {
        toValue: i === state.index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  return (
    <View style={[styles.absoluteWrapper, { bottom: insets.bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const anim = animations[index];
          const isFocused = state.index === index;

          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -15],
          });

          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={styles.tab}
            >
              <Animated.View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isFocused ? '#fff' : 'transparent',
                    borderRadius:50,
                    padding:7,
                    transform: [{ translateY }, { scale }],
                  },
                ]}
              >
                {React.createElement(iconMap[route.name], {
                  size: 22,
                  color: isFocused ? '#012D2E' : '#ffffffde',
                })}
              </Animated.View>

              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomBar;

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

  bar: {
    flexDirection: 'row',
    height: 75,
    backgroundColor: '#008E6D',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 10,
    alignItems: 'flex-end',
    paddingBottom: 10,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  label: {
    fontSize: 11,
    color: '#ffffffde',
    fontWeight:'600',
    marginTop:6,
  },

  activeLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
