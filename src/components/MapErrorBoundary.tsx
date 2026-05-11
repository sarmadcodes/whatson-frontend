import React from 'react';
import { Text, View } from 'react-native';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class MapErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', textAlign: 'center' }}>
            Map failed to load
          </Text>
          <Text style={{ fontSize: 13, color: '#64748b', marginTop: 6, textAlign: 'center' }}>
            Check Google Maps API key setup in AndroidManifest.xml and iOS config.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
