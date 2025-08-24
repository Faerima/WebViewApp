import React from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OrderWebView from './src/OrderWebView';
import config from './config';

/**
 * WebView Orders App - Professional SafeArea Solution
 * 
 * Konfiguration erfolgt zentral in ./config.ts
 * Restaurant-URL und erlaubte Hosts werden automatisch geladen
 * Professionelle SafeArea-Integration für alle Geräte
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* StatusBar für moderne Geräte */}
      <StatusBar 
        barStyle="default"
        backgroundColor="transparent"
        translucent={true}
      />
      
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <OrderWebView
          visible={true}
          onClose={() => {}} // No closing possible - App is the WebView
          // startUrl und allowedHosts werden automatisch aus config.ts geladen
          disableZoom={true} // Für besseren Native App Look
          onEvent={(e) => {}} // Event handler for WebView events
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // SafeAreaView übernimmt automatisch die korrekte Notch/StatusBar-Behandlung
    backgroundColor: '#FFFFFF', // Fallback-Farbe
  },
});
