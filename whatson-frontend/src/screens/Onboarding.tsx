import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Onboarding = ({ navigation }: { navigation: any }) => {
  // Minimal placeholder — keep existing onboarding UI but ensure final button navigates to Loginscreen
  const finish = () => {
    navigation.replace('Loginscreen');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Onboarding (placeholder)</Text>
      <TouchableOpacity onPress={finish} style={{ padding: 12, backgroundColor: '#008E6D', borderRadius: 8 }}>
        <Text style={{ color: '#fff' }}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
