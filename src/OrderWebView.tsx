import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Linking, StyleSheet, Platform, BackHandler } from 'react-native';
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
  const [canGoBack, setCanGoBack] = useState(false);

  // Überwache Netzwerkverbindung
  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => setConnected(!!s.isConnected));
    return () => unsub();
  }, []);

  // Hardware Zurück-Button (Android)
  useEffect(() => {
    if (!visible) return;
    
    const backAction = () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true; // Event behandelt
      }
      return false; // Normale App-Exit Behandlung
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible, canGoBack]);

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
    setCanGoBack(nav.canGoBack);
    
    if (!isAllowedHost(nav.url)) {
      handleExternal(nav.url);
      webRef.current?.stopLoading();
      return;
    }
    onEvent({ type: 'navigation', payload: { url: nav.url, canGoBack: nav.canGoBack } });
  };

  // Should Start Load Handler (iOS/Android)
  const onShouldStart: WebViewProps['onShouldStartLoadWithRequest'] = req => {
    if (!isAllowedHost(req.url)) {
      handleExternal(req.url);
      return false;
    }
    return true;
  };

  // Wenn nicht sichtbar, nichts rendern
  if (!visible) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
      
      {/* WebView ohne automatische Insets - SafeAreaView regelt das */}
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
        onMessage={event => onEvent({ type: 'message', payload: event.nativeEvent.data })}
        mixedContentMode={Platform.OS === 'android' ? 'always' : 'never'}
        style={styles.webview}
        // Pull-to-Refresh aktivieren
        pullToRefreshEnabled={true}
        bounces={true}
        // Bessere Scroll-Performance
        decelerationRate={0.998}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E5C2', // Splash-Farbe für Übergänge
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  offline: { 
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  retry: { 
    marginTop: 8, 
    textDecorationLine: 'underline',
    color: '#2196F3',
  },
  loader: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    marginLeft: -10, 
    marginTop: -10,
    zIndex: 1000,
  },
});
