/**
 * HAUPTKOMPONENTE DER RESTAURANT-APP
 * ==================================
 * 
 * Diese Komponente ist der Einstiegspunkt der App und konfiguriert:
 * - SafeArea-Behandlung für alle Geräte (iPhone Notch, Android etc.)
 * - StatusBar-Integration (Uhrzeit, Batterie bleiben sichtbar)
 * - Automatisches Laden der Restaurant-Konfiguration aus config.ts
 * 
 * WICHTIG: Diese Datei muss normalerweise NICHT geändert werden!
 * Alle Restaurant-spezifischen Einstellungen sind in config.ts
 */

import React from 'react';
import { StyleSheet, StatusBar, Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OrderWebView from './src/OrderWebView';
import config from './config';

/**
 * Haupt-App-Komponente
 * ====================
 * 
 * Konfiguriert die App für professionelle Mobile Experience:
 * 
 * 1. SafeAreaProvider: Automatische Behandlung von Notch/StatusBar
 * 2. StatusBar: Sichtbar mit transparentem Hintergrund
 * 3. SafeAreaView: Verhindert Überlappung mit System-UI
 * 4. OrderWebView: Die eigentliche Restaurant-WebView
 * 
 * Die Restaurant-Konfiguration wird automatisch aus config.ts geladen!
 */
export default function App() {
  // Automatische Erkennung des System-Themes (Light/Dark Mode)
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      {/* 
        StatusBar-Konfiguration für moderne Mobile Experience
        - barStyle="light-content": Immer helle Texte (weiß) für beste Sichtbarkeit
        - backgroundColor="transparent": Durchsichtige StatusBar
        - translucent={true}: StatusBar überlagert Content nicht
      */}
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/*
        SafeAreaView mit vollständigen Edges
        Verhindert, dass Content unter Notch/StatusBar/Navigation verschwindet
        
        edges={['top', 'bottom', 'left', 'right']}:
        - top: Respektiert iPhone Notch/Dynamic Island
        - bottom: Respektiert Home Indicator
        - left/right: Respektiert Landscape-Modi
      */}
      <SafeAreaView 
        style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#1a1a1a' }]} 
        edges={['top', 'bottom', 'left', 'right']}
      >
        {/*
          OrderWebView - Die eigentliche Restaurant-WebView
          
          Konfiguration erfolgt automatisch über config.ts:
          - startUrl: Wird aus config.url geladen
          - allowedHosts: Wird aus config.allowedHosts geladen
          - disableZoom: Für besseren Native App Look
          
          KEINE manuellen Änderungen hier nötig!
        */}
        <OrderWebView
          visible={true}
          onClose={() => {}} // No closing possible - App is the WebView
          disableZoom={true} // Zoom deaktiviert für Native App Look
          onEvent={(e) => {}} // Event handler for WebView events (optional)
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/**
 * StyleSheet für App-Container
 * ============================
 *
 * Minimale Styling-Konfiguration:
 * - flex: 1 = Nutzt gesamten verfügbaren Bildschirm
 * - backgroundColor: Wird dynamisch gesetzt basierend auf System-Theme
 *   - Light Mode: Dunkelgrau (#1a1a1a) für StatusBar-Sichtbarkeit
 *   - Dark Mode: Schwarz (#000000) für perfekte Integration
 *
 * SafeAreaView übernimmt automatisch die korrekte
 * Notch/StatusBar-Behandlung für alle Geräte!
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor wird dynamisch in der Komponente gesetzt
  },
});
