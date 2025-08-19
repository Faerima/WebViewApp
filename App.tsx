import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import OrderWebView from './src/OrderWebView';

/**
 * Roemerhof Bestellungen App
 * 
 * Startet direkt mit der WebView für https://roemerhof.kuriersoft.ch/
 * SafeAreaView wird in OrderWebView gehandhabt
 */
export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#2C2C2E' : '#F8E5C2';
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <OrderWebView
        visible={true}
        onClose={() => {}} // Kein Schließen möglich - App ist die WebView
        startUrl="https://roemerhof.kuriersoft.ch/"
        allowedHosts={['roemerhof.kuriersoft.ch','www.roemerhof.kuriersoft.ch']}
        onEvent={(e) => console.log('WebView event:', e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor wird dynamisch gesetzt
  },
});
