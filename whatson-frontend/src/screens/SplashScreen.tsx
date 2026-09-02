import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  ScrollView,
  StatusBar,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: { navigation: any }) => {
  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onboardingData = [
    {
      title: "What's On",
      subtitle: "Your night out, sorted",
      description: "Discover what's happening around you: live music, comedy, events, nightlife & more.",
      image: require('../assets/onboard1.png'),
    },
    {
      title: "Find What's Nearby",
      subtitle: "Events at your fingertips.",
      description: "Explore bars, venues and events near you with our location-based discovery.",
      image: require('../assets/onboard2.png'),
    },
    {
      title: "Plan Your Night",
      subtitle: "Never miss a thing.",
      description: "From pub quizzes to DJ sets—find the perfect way to spend your evening.",
      image: require('../assets/onboard3.png'),
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep > 1) {
        scrollRef.current?.scrollTo({ x: (nextStep - 1) * width, animated: true });
      }
    } else {
      navigation.replace('BottomTabs');
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 0) {
      timer = setTimeout(() => {
        handleNext();
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollOffset / width);
    setStep(currentIndex + 1);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar 
        barStyle={step === 0 ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />

      <View style={styles.containerWhite}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          bounces={false}
          scrollEventThrottle={16}
        >
          {onboardingData.map((slide, index) => (
            <View key={index} style={styles.slideWrapper}>
              <ImageBackground
                source={slide.image}
                style={styles.topImage}
                resizeMode="cover"
              >
                <SafeAreaView style={styles.topControls}>
                  <TouchableOpacity 
                    style={styles.backButtonCircle} 
                    onPress={() => step > 1 && setStep(step - 1)}
                  >
                     <Text style={{fontSize: 20}}>←</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.replace('BottomTabs')}>
                    <Text style={styles.skipText}>Skip</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </ImageBackground>

              <View style={styles.contentArea}>
                <View style={styles.greenIconBox}> 
                  <Text style={{color: '#fff', fontSize: 20}}>✨</Text>
                </View> 
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, step === i && styles.activeDot]} />
            ))}
          </View>
          <TouchableOpacity style={styles.nextCircle} onPress={handleNext}>
            <Text style={{color: '#fff', fontSize: 24}}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {step === 0 && (
        <View style={styles.fullBrandingOverlay}>
          <Text style={{ fontSize: 42, fontWeight: '800', color: '#fff' }}>What's On</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  fullBrandingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#008E6D', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 999 
  },
  containerWhite: { flex: 1, backgroundColor: '#FFF' },
  slideWrapper: { width: width, flex: 1 },
  topImage: { height: height * 0.5, width: width },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 40 },
  backButtonCircle: { width: 35, height: 35, backgroundColor: '#FFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  skipText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  contentArea: { flex: 1, paddingHorizontal: 30, paddingTop: 20 },
  greenIconBox: { width: 42, height: 42, backgroundColor: '#74C33C', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 38, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 20, fontWeight: '700', color: '#008E6D', marginBottom: 15 },
  description: { fontSize: 16, lineHeight: 24, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: 40, left: 30, right: 30 },
  pagination: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginRight: 8 },
  activeDot: { width: 26, height: 6, borderRadius: 3, backgroundColor: '#008E6D' },
  nextCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#008E6D', justifyContent: 'center', alignItems: 'center' }
});

export default SplashScreen;
