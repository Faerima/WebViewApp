import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import OrderWebView from './src/OrderWebView';

/**
 * Roemerhof Orders App
 * 
 * Launches directly with WebView for https://roemerhof.kuriersoft.ch/
 * SafeAreaView is handled within OrderWebView component
 */
export default function App() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#2C2C2E' : '#F8E5C2';
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <OrderWebView
        visible={true}
        onClose={() => {}} // No closing possible - App is the WebView
        startUrl="https://roemerhof.kuriersoft.ch/"
        allowedHosts={['roemerhof.kuriersoft.ch','www.roemerhof.kuriersoft.ch']}
        onEvent={(e) => {}} // Event handler for WebView events
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is set dynamically based on color scheme
  },
});
