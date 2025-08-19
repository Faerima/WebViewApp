import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Linking, StyleSheet, Platform, BackHandler, StatusBar, useColorScheme } from 'react-native';
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
 * Reusable WebView component for online ordering
 * 
 * Features:
 * - Full-screen WebView without modal overlay
 * - Host whitelist for secure navigation
 * - External links open in system browser
 * - Offline detection with retry functionality
 * - Zoom disable for mobile optimization
 * - Event callbacks for navigation and messages
 * - Cookie support for session management
 * - Dynamic Light/Dark Mode support
 * - Hardware back button navigation (Android)
 * - Pull-to-refresh functionality
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
  const colorScheme = useColorScheme();

  // Dynamic StatusBar configuration based on color scheme
  const getStatusBarConfig = () => {
    const isDark = colorScheme === 'dark';
    return {
      barStyle: isDark ? 'light-content' : 'dark-content',
      backgroundColor: isDark ? '#2C2C2E' : '#F8E5C2', // Dark background for Dark Mode
    };
  };

  // Monitor network connection
  useEffect(() => {
    const unsub = NetInfo.addEventListener(s => setConnected(!!s.isConnected));
    return () => unsub();
  }, []);

  // Hardware back button handling (Android)
  useEffect(() => {
    if (!visible) return;
    
    const backAction = () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true; // Event handled
      }
      return false; // Normal app exit handling
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible, canGoBack]);

  // Injected JavaScript to disable zoom
  const injectedJS = useMemo(() => {
    if (!disableZoom) return '';
    // Sets viewport and prevents pinch-to-zoom
    return `(function(){
      var m=document.querySelector('meta[name=viewport]');
      if(!m){ m=document.createElement('meta'); m.name='viewport'; document.head.appendChild(m); }
      m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
      true;
    })();`;
  }, [disableZoom]);

  // Extract hostname from URL
  const getHost = (url: string) => {
    try { return new URL(url).hostname; } catch { return ''; }
  };

  // Check if host is in whitelist
  const isAllowedHost = (url: string) => allowedHosts.includes(getHost(url));

  // Open external links in system browser
  const handleExternal = (url: string) => {
    Linking.openURL(url).catch(() => {});
    onEvent({ type: 'externalLink', payload: { url } });
  };

  // Navigation state change handler
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

  // Should start load handler (iOS/Android)
  const onShouldStart: WebViewProps['onShouldStartLoadWithRequest'] = req => {
    if (!isAllowedHost(req.url)) {
      handleExternal(req.url);
      return false;
    }
    return true;
  };

  // If not visible, render nothing
  if (!visible) {
    return null;
  }

  const statusBarConfig = getStatusBarConfig();

  return (
    <View style={[styles.container, { backgroundColor: statusBarConfig.backgroundColor }]}>
      {/* StatusBar dynamically adapted to Light/Dark Mode */}
      <StatusBar 
        barStyle={statusBarConfig.barStyle as any}
        backgroundColor={statusBarConfig.backgroundColor}
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Offline notification */}
        {!connected && (
          <View style={styles.offline}>
            <Text>No internet connection</Text>
            <TouchableOpacity onPress={() => NetInfo.fetch().then(s => setConnected(!!s.isConnected))}>
              <Text style={styles.retry}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Loading indicator */}
        {loading && <ActivityIndicator size="large" style={styles.loader} />}
        
        {/* WebView with full configuration */}
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
          // Enable pull-to-refresh
          pullToRefreshEnabled={true}
          bounces={true}
          // Better scroll performance
          decelerationRate={0.998}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is set dynamically based on color scheme
  },
  safeArea: {
    flex: 1,
    // Additional padding for Android if SafeAreaView is not sufficient
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
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
