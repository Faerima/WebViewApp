import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderWebView from './src/OrderWebView';

/**
 * Roemerhof Bestellungen App
 * 
 * Startet direkt mit der WebView für https://roemerhof.kuriersoft.ch/
 * SafeAreaView wird in OrderWebView gehandhabt
 */
export default function App() {
  return (
    <View style={styles.container}>
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
    backgroundColor: '#F8E5C2', // Passend zum Splash Screen
  },
});
