import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ScreenWrapper from '../components/ScreenWrapper';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: "What's On",
    subtitle: 'Your night out, sorted',
    description: 'Discover what’s happening around you, live music, comedy, events, nightlife & more.',
    icon: 'sparkles-sharp',
  },
  {
    id: '2',
    title: "Find What's Nearby",
    subtitle: 'Events at your fingertips.',
    description: 'Explore bars, venues and events near you with our location-based discovery.',
    icon: 'pin-sharp',
  },
  {
    id: '3',
    title: 'Plan Your Night',
    subtitle: 'Never miss a thing. ',
    description: 'From pub quizzes to DJ sets — find the perfect way to spend your evening.',
    icon: 'moon-sharp',
  },
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < ONBOARDING_DATA.length) {
      flatListRef.current.scrollToOffset({ offset: nextIndex * width, animated: true });
    }
  };

  const skipToLast = () => {
    const lastIndex = ONBOARDING_DATA.length - 1;
    flatListRef.current.scrollToOffset({ offset: lastIndex * width, animated: true });
  };

  const Slide = ({ item }) => {
    return (
      <View style={styles.slideWrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name={item.icon} size={25} color="white" />
          </View>
          
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          
          <View style={styles.descBox}>
             <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenWrapper
        imageSource={require('../assets/onboard1.png')}
        backgroundColor="#FFFFFF"
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Header - Fixed to top */}
        <View style={styles.header}>
          <View style={{ width: 60 }}>
            {currentIndex > 0 && (
              <TouchableOpacity onPress={() => flatListRef.current.scrollToOffset({ offset: (currentIndex - 1) * width, animated: true })}>
                <Text style={styles.headerActionText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={skipToLast} style={styles.skipCircle}>
             <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          pagingEnabled
          data={ONBOARDING_DATA}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <Slide item={item} />}
          keyExtractor={(item) => item.id}
          // Smoothness fixes:
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          disableIntervalMomentum={true}
          scrollEventThrottle={16}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {ONBOARDING_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              if (currentIndex === ONBOARDING_DATA.length - 1) {
                navigation.replace('BottomTabs');
              } else {
                goToNextSlide();
              }
            }}
            style={styles.nextBtn}
          >
            <Ionicons 
              name={currentIndex === ONBOARDING_DATA.length - 1 ? "checkmark-sharp" : "arrow-forward-sharp"} 
              size={25} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
  },
  headerActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  skipCircle: {
    backgroundColor: '#008E6D',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  skipBtnText: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  slideWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  contentContainer: {
    // alignItems: 'center',
    paddingHorizontal: 20,
    width: width,
  },
  iconBackground: {
    width:55, height:55,
    alignItems: 'center', justifyContent:'center',
    backgroundColor: '#74C33C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    elevation:5
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#012D2E',
    // textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#008E6D',
    fontWeight: '700',
    marginTop: 5,
    // textAlign: 'center',
  },
  descBox: {
    paddingRight: 40,
    marginTop: 20,
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: '#666',
    // textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    height: 6,
    width: 15,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
    borderRadius: 3,
  },
  activeIndicator: {
    backgroundColor: '#008E6D',
    width: 30,
  },
  nextBtn: {
    width: 55,
    height: 55,
    backgroundColor: '#008E6D',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Onboarding;