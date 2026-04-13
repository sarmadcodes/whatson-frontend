import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons = {
  Discover: 'home-outline',
  Maps: 'map-outline',
  Browse: 'add-outline',
  Search: 'search-outline',
  Profile: 'person',
};

const CustomBottomBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  // Animated values for each tab
  const animations = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  useEffect(() => {
    // Animate all icons
    animations.forEach((anim, i) => {
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
        {state.routes.map((route, index) => {
          const anim = animations[index];
          const isFocused = state.index === index;

          // Lift icon by interpolating the animated value
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -15], // lift only icon
          });

          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2], // optional small scale
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
              style={styles.tab}
            >
              {/* ICON */}
              <Animated.View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isFocused ? '#fff' : 'transparent',
                    borderRadius:50,
                    padding:7,
                  },
                ]}
              >
                <Ionicons
                  name={icons[route.name]}
                  size={22}
                  color={isFocused ? '#012D2E' : '#ffffffde'}
                />
              </Animated.View>

              {/* LABEL stays fixed */}
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

  // iconWrapper: {
  //   borderRadius: 50,
  //   borderWidth: 1,
  //   borderColor: '#D9D9DA',
  //   backgroundColor: '#FEFDFB',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginBottom: 2, 
  //   padding:4
  // },

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
