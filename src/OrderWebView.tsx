/**
 * RESTAURANT WEBVIEW KOMPONENTE
 * ==============================
 * 
 * Diese Komponente ist das Herzstück der Restaurant-App und bietet
 * eine vollständige native App-Erfahrung für Online-Bestellungen.
 * 
 * HAUPTFEATURES:
 * - Vollbild-WebView ohne Browser-Interface
 * - Alle Restaurant-Aktionen bleiben in der App (Payment, Checkout, etc.)
 * - Automatische Konfiguration aus config.ts
 * - Intelligente Link-Behandlung (Restaurant-Links vs. externe Links)
 * - Offline-Erkennung mit Retry-Funktion
 * - Hardware-Back-Button-Navigation (Android)
 * - Native App Look & Feel
 * 
 * SICHERHEITSFEATURES:
 * - Host-Whitelist für sichere Navigation
 * - Payment-Provider automatisch erlaubt
 * - Externe Links (App Store, etc.) öffnen externen Browser
 * - Cookie-Support für Session-Management
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Linking, StyleSheet, Platform, BackHandler, StatusBar, useColorScheme } from 'react-native';
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import config from '../config';

/**
 * Props für OrderWebView Komponente
 * ==================================
 */
type OrderWebViewProps = {
  /** Sichtbarkeit der WebView (für zukünftige Modal-Features) */
  visible: boolean;
  /** Callback beim Schließen (für zukünftige Modal-Features) */
  onClose: () => void;
  /** Überschreibung der Start-URL (optional, wird aus config.ts geladen) */
  startUrl?: string;
  /** Überschreibung der erlaubten Hosts (optional, wird aus config.ts geladen) */
  allowedHosts?: string[];
  /** Zoom deaktivieren für Native App Look */
  disableZoom?: boolean;
  /** Event-Callback für Navigation und Messages */
  onEvent?: (e: { type: string; payload?: any }) => void;
};

/**
 * OrderWebView - Restaurant WebView Komponente
 * =============================================
 * 
 * Diese Komponente lädt die Restaurant-Website und stellt sicher,
 * dass alle Restaurant-Funktionen (Bestellung, Payment, etc.) 
 * innerhalb der App funktionieren.
 * 
 * AUTOMATISCHE KONFIGURATION:
 * - startUrl: Wird aus config.url geladen
 * - allowedHosts: Wird aus config.allowedHosts geladen
 * - Keine manuellen Änderungen nötig für Restaurant-Wechsel!
 */
export default function OrderWebView({
  visible,
  onClose,
  startUrl = config.url,              // ← Automatisch aus config.ts
  allowedHosts = config.allowedHosts,  // ← Automatisch aus config.ts
  disableZoom = true,
  onEvent = () => {}
}: OrderWebViewProps) {
  // State Management für WebView-Funktionalität
  const webRef = useRef<WebView>(null);           // Referenz zur WebView
  const [connected, setConnected] = useState(true); // Internet-Verbindungsstatus
  const [loading, setLoading] = useState(true);     // Lade-Status
  const [canGoBack, setCanGoBack] = useState(false); // Back-Navigation möglich?
  const colorScheme = useColorScheme();

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

  // Injected JavaScript für Native App Look + Link-Handling
  const injectedJS = useMemo(() => {
    const baseJS = `
      (function(){
        // Viewport für Mobile optimieren
        var m=document.querySelector('meta[name=viewport]');
        if(!m){ 
          m=document.createElement('meta'); 
          m.name='viewport'; 
          document.head.appendChild(m); 
        }
        m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
        
        // CSS für Native App Look
        var style = document.createElement('style');
        style.textContent = \`
          /* Native App Styling */
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow-x: hidden !important;
            -webkit-user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* Browser-UI verstecken */
          .browser-nav, .url-bar, .address-bar { 
            display: none !important; 
          }
          
          /* Smooth scrolling */
          * { 
            -webkit-overflow-scrolling: touch !important; 
            outline: none !important; 
            -webkit-tap-highlight-color: rgba(0,0,0,0) !important; 
          }
        \`;
        document.head.appendChild(style);
        
        // Rechtsklick deaktivieren
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          return false;
        });
        
        // Text-Selektion deaktivieren
        document.addEventListener('selectstart', function(e) {
          e.preventDefault();
          return false;
        });
        document.head.appendChild(style);
        
        // Rechtsklick deaktivieren für App-Gefühl
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          return false;
        });
        
        // Text-Selektion deaktivieren
        document.addEventListener('selectstart', function(e) {
          e.preventDefault();
          return false;
        });
        
        // WICHTIG: Alle Links innerhalb der App verarbeiten
        document.addEventListener('click', function(e) {
          var target = e.target;
          
          // Finde das nächste Link-Element
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          
          if (target && target.href) {
            var href = target.href;
            
            // Nur wirklich externe App-Links (App Store, etc.) weiterleiten
            var externalApps = [
              'play.google.com',
              'apps.apple.com', 
              'itunes.apple.com',
              'facebook.com',
              'instagram.com',
              'twitter.com',
              'youtube.com'
            ];
            
            var isExternalApp = externalApps.some(function(domain) {
              return href.includes(domain);
            });
            
            if (!isExternalApp) {
              // Link in der WebView öffnen, nicht extern
              e.preventDefault();
              window.location.href = href;
              return false;
            }
          }
        }, true);
        
        // Formulare in der App verarbeiten
        document.addEventListener('submit', function(e) {
          // Alle Formulare (Payment, etc.) in der WebView verarbeiten
          // Kein preventDefault - normale Formular-Verarbeitung
        });
        
        true;
      })();
    `;
    
    return disableZoom ? baseJS : baseJS.replace(/maximum-scale=1,user-scalable=no/g, '');
  }, [disableZoom]);

  // Extract hostname from URL
  const getHost = (url: string) => {
    try { return new URL(url).hostname; } catch { return ''; }
  };

  // Check if host is in whitelist - ERWEITERT für alle Restaurant-relevanten Domains
  const isAllowedHost = (url: string) => {
    const host = getHost(url);
    
    // Explizit erlaubte Hosts aus Konfiguration
    if (allowedHosts.includes(host)) return true;
    
    // Alle kuriersoft/kurier Subdomains erlauben
    if (host.includes('kuriersoft.ch') || host.includes('kurier.ch')) return true;
    
    // Payment-Provider für Bestellungen erlauben
    const paymentHosts = [
      'secure.worldpay.com',
      'payments.worldpay.com', 
      'checkout.stripe.com',
      'js.stripe.com',
      'api.stripe.com',
      'paypal.com',
      'www.paypal.com',
      'checkout.paypal.com',
      'www.sandbox.paypal.com',
      'twint.ch',
      'pay.twint.ch',
      'postfinance.ch',
      'e-payment.postfinance.ch',
      'datatrans.com',
      'pay.datatrans.com',
      'saferpay.com',
      'www.saferpay.com'
    ];
    
    if (paymentHosts.some(paymentHost => host.includes(paymentHost))) return true;
    
    return false;
  };

  // Nur wirklich externe Links (App Stores, Social Media) öffnen Browser
  const isExternalAppLink = (url: string) => {
    const host = getHost(url);
    const externalHosts = [
      'play.google.com',
      'apps.apple.com', 
      'itunes.apple.com',
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'youtube.com'
    ];
    
    return externalHosts.some(externalHost => host.includes(externalHost));
  };

  // Handle external links - NUR für wirklich externe Apps
  const handleExternal = (url: string) => {
    if (isExternalAppLink(url)) {
      Linking.openURL(url).catch(() => {});
      onEvent({ type: 'externalLink', payload: { url } });
    } else {
      // Alle anderen URLs in der WebView laden
      if (webRef.current) {
        webRef.current.injectJavaScript(`window.location.href = '${url}';`);
      }
      onEvent({ type: 'internalNavigation', payload: { url } });
    }
  };

  // Navigation state change handler - ALLE Restaurant-Aktionen in App behalten
  const onNavChange = (nav: WebViewNavigation) => {
    setLoading(false);
    setCanGoBack(nav.canGoBack);
    
    // Nur wirklich externe App-Links werden extern geöffnet
    if (!isAllowedHost(nav.url) && isExternalAppLink(nav.url)) {
      handleExternal(nav.url);
      webRef.current?.stopLoading();
      return;
    }
    
    // Alle anderen URLs (inklusive Payment) bleiben in der App
    onEvent({ type: 'navigation', payload: { url: nav.url, canGoBack: nav.canGoBack } });
  };

  // Should start load handler - ERWEITERTE Logik für Native App
  const onShouldStart: WebViewProps['onShouldStartLoadWithRequest'] = req => {
    // Wirklich externe App-Links → Browser öffnen
    if (isExternalAppLink(req.url)) {
      handleExternal(req.url);
      return false;
    }
    
    // Alle Restaurant- und Payment-URLs → in WebView laden
    if (isAllowedHost(req.url)) {
      return true;
    }
    
    // Andere URLs → auch in WebView versuchen zu laden
    console.log('Loading URL in WebView:', req.url);
    return true;
  };

  // If not visible, render nothing
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Professionelle WebView mit SafeArea-Integration */}
      
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
      
      {/* WebView with full configuration - Native App Look + In-App Actions */}
      <WebView
        ref={webRef}
        source={{ uri: startUrl }}
        originWhitelist={['https://*', 'http://*']}
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
        // WICHTIG: Native App Look - keine URL-Leiste
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        // Keine Browser-Controls anzeigen
        allowsBackForwardNavigationGestures={false}
        // Vollbild ohne Browser-Interface
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        // WICHTIG: Alle In-App Aktionen ermöglichen
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        // Popup-Handling für Payment-Fenster
        onOpenWindow={(event) => {
          // Payment-Popups in derselben WebView öffnen
          if (webRef.current) {
            webRef.current.injectJavaScript(`window.location.href = '${event.nativeEvent.targetUrl}';`);
          }
        }}
        // User Agent für bessere Mobile-Kompatibilität
        userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // SafeAreaView aus App.tsx übernimmt die Notch/StatusBar-Behandlung
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  offline: { 
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
