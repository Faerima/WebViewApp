import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Linking, StyleSheet, Platform } from 'react-native';
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

type OrderWebViewProps = {
  visible: boolean;
  onClose: () => void;
  startUrl?: string;
  allowedHosts?: string[];
  disableZoom?: boolean;
  onEvent?: (e: { type: string; payload?: any }) => void;
};

const DEFAULT_URL = 'https://roemerhof.kuriersoft.ch/';

/**
 * Wiederverwendbare WebView-Komponente für Online-Bestellungen
 * 
 * Features:
 * - Vollbildmodus mit Modal
 * - Host-Whitelist für sichere Navigation
 * - Externe Links öffnen im Systembrowser
 * - Offline-Erkennung mit Retry-Funktion
 * - Zoom-Deaktivierung für mobile Optimierung
 * - Event-Callbacks für Navigation und Messages
 * - Cookie-Unterstützung für Session-Management
 */
export default function OrderWebView({
  visible,
  onClose,
  startUrl = DEFAULT_URL,
  allowedHosts = ['roemerhof.kuriersoft.ch', 'www.roemerhof.kuriersoft.ch'],
  disableZoom = true,
  onEvent = () => {}
}: OrderWebViewProps) {
  const webRef = useRef<WebView>(null);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  // Überwache Netzwerkverbindung
  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => setConnected(!!s.isConnected));
    return () => unsub();
  }, []);

  // Injiziertes JavaScript zum Deaktivieren von Zoom
  const injectedJS = useMemo(() => {
    if (!disableZoom) return '';
    // Setzt den Viewport und verhindert Pinch-to-Zoom
    return `(function(){
      var m=document.querySelector('meta[name=viewport]');
      if(!m){ m=document.createElement('meta'); m.name='viewport'; document.head.appendChild(m); }
      m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
      true;
    })();`;
  }, [disableZoom]);

  // Extrahiert Hostname aus URL
  const getHost = (url: string) => {
    try { return new URL(url).hostname; } catch { return ''; }
  };

  // Prüft ob Host in Whitelist enthalten ist
  const isAllowedHost = (url: string) => allowedHosts.includes(getHost(url));

  // Öffnet externe Links im Systembrowser
  const handleExternal = (url: string) => {
    Linking.openURL(url).catch(() => {});
    onEvent({ type: 'externalLink', payload: { url } });
  };

  // Navigation State Change Handler
  const onNavChange = (nav: WebViewNavigation) => {
    setLoading(false);
    if (!isAllowedHost(nav.url)) {
      handleExternal(nav.url);
      webRef.current?.stopLoading();
      return;
    }
    onEvent({ type: 'navigation', payload: { url: nav.url } });
  };

  // Should Start Load Handler (iOS/Android)
  const onShouldStart: WebViewProps['onShouldStartLoadWithRequest'] = req => {
    if (!isAllowedHost(req.url)) {
      handleExternal(req.url);
      return false;
    }
    return true;
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Offline-Hinweis */}
        {!connected && (
          <View style={styles.offline}>
            <Text>Keine Internetverbindung</Text>
            <TouchableOpacity onPress={() => NetInfo.fetch().then(s => setConnected(!!s.isConnected))}>
              <Text style={styles.retry}>Erneut versuchen</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" style={styles.loader} />}
        
        {/* WebView */}
        <WebView
          ref={webRef}
          source={{ uri: startUrl }}
          originWhitelist={['https://*']}
          onNavigationStateChange={onNavChange}
          onShouldStartLoadWithRequest={onShouldStart}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setSupportMultipleWindows={false}
          injectedJavaScript={injectedJS}
          // Android: öffnet target=_blank nicht in neuem Fenster
          onMessage={event => onEvent({ type: 'message', payload: event.nativeEvent.data })}
          mixedContentMode={Platform.OS === 'android' ? 'always' : 'never'}
        />
        
        {/* Schließen Button */}
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text>Schliessen</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  offline: { 
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  retry: { 
    marginTop: 8, 
    textDecorationLine: 'underline' 
  },
  loader: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    marginLeft: -10, 
    marginTop: -10 
  },
  close: { 
    position: 'absolute', 
    right: 16, 
    top: 12, 
    padding: 8, 
    backgroundColor: '#eee', 
    borderRadius: 8 
  }
});
