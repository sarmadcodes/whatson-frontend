import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ScreenWrapper = ({
  children,
  imageSource,
  backgroundColor = '#FFFFFF',
}: {
  children: React.ReactNode;
  imageSource: any;
  backgroundColor?: string;
}) => {
  const IMAGE_HEIGHT = height * 0.33;

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <View style={{ height: IMAGE_HEIGHT, width: width, position: 'absolute', top: 0 }}>
        <Image
          source={imageSource}
          style={styles.fullImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.4)',
            backgroundColor,
            backgroundColor,
          ]}
          locations={[0, 0.4, 0.85, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullImage: { width: '100%', height: '100%' },
  contentContainer: { flex: 1, backgroundColor: 'transparent', marginVertical: 35, paddingHorizontal: 15 },
});

export default ScreenWrapper;
