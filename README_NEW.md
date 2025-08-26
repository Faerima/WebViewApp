# WebViewApp - Professional Restaurant App

Eine vollständig konfigurierte React Native/Expo App für Kuriersoft-Restaurant-Bestellungen mit nativer App-Erfahrung.

## 🎯 Überblick

Diese App wurde speziell für Kuriersoft-Restaurants entwickelt und bietet eine **vollständig native App-Erfahrung** für Online-Bestellungen. Mit nur **einer einzigen Konfigurationsänderung** kann die App für verschiedene Restaurants verwendet werden.

### ✨ Hauptmerkmale

- **🔄 Ein-Klick Restaurant-Wechsel** - Nur `config.ts` ändern
- **📱 Native App Experience** - Keine Browser-Elemente sichtbar
- **💳 In-App Payment** - Alle Zahlungen bleiben in der App
- **🔒 Sicherheit** - Intelligente Link-Behandlung
- **📶 Offline-Support** - Automatische Verbindungserkennung
- **🎨 SafeArea-Integration** - Perfekt für alle Geräte (Notch, etc.)

## 🚀 Features im Detail

### 🍕 Restaurant-Features
- **Kompletter Bestellvorgang in der App** (Auswahl → Warenkorb → Checkout → Payment)
- **Payment-Provider Integration** (Stripe, PayPal, TWINT, PostFinance, Datatrans)
- **Session-Management** mit Cookies für persistente Logins
- **Account-Funktionen** (Login, Bestellhistorie, etc.)

### 📱 Mobile Experience
- **StatusBar sichtbar** (Uhrzeit, Batterie, Signal)
- **SafeArea-Integration** für iPhone Notch/Dynamic Island
- **Hardware Back Button** Navigation (Android)
- **Pull-to-Refresh** Funktionalität
- **Zoom deaktiviert** für Native App Look
- **Keine URL-Leiste** oder Browser-Interface

### 🔧 Technische Features
- **Host-Whitelist Sicherheit** - Nur erlaubte Domains in der App
- **Intelligente Link-Behandlung** - Restaurant-Links in App, externe Links im Browser
- **Offline-Erkennung** mit Retry-Button
- **Cross-Platform** (iOS & Android)
- **TypeScript** für Typsicherheit

## 📂 Projektstruktur

```
WebViewApp/
├── config.ts              ← 🎯 ZENTRALE KONFIGURATION
├── App.tsx                 ← Haupt-App mit SafeArea
├── src/
│   └── OrderWebView.tsx    ← Restaurant WebView-Komponente
├── app.json               ← Expo/EAS Konfiguration
├── eas.json               ← Build-Konfiguration
└── assets/                ← App-Icons und Splash
```

### 📋 Wichtige Dateien

- **`config.ts`** → **HIER Restaurant-URL ändern** (einzige Datei die geändert werden muss!)
- **`App.tsx`** → SafeArea-Provider und StatusBar-Konfiguration
- **`OrderWebView.tsx`** → WebView-Komponente mit allen Features
- **`app.json`** → App-Metadaten und Expo-Konfiguration
- **`eas.json`** → Build-Pipeline für Android APK/AAB

## 🛠️ Installation & Setup

### Voraussetzungen (einmalig)
- **Node.js 18-20** installiert
- **npm** oder **yarn** installiert
- **Git** installiert
- **Expo Account** erstellen auf [expo.dev](https://expo.dev)
- **EAS CLI** installieren: `npm install -g eas-cli`

### 1. Projekt Setup
```bash
# Repository klonen
git clone <repository-url>
cd WebViewApp

# Abhängigkeiten installieren
npm install

# EAS Login (einmalig)
eas login
```

## 🎯 Restaurant-Konfiguration

### **🔥 Super Einfach: Nur eine Datei ändern!**

Für jeden Restaurant-Wechsel muss nur `config.ts` geändert werden:

#### **Option 1: Vordefinierte Restaurants** (Empfohlen)
```typescript
// In config.ts - NUR DIESE ZEILE ÄNDERN:
const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.pizzafulmine;
// oder
const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.roemerhof;
```

#### **Option 2: Manuell konfigurieren**
```typescript
// In config.ts
const CURRENT_RESTAURANT: RestaurantConfig = {
  url: 'https://restaurant-name.kuriersoft.ch/',
  allowedHosts: [
    'restaurant-name.kuriersoft.ch',
    'www.restaurant-name.kuriersoft.ch',
    'kuriersoft.ch',
    'www.kuriersoft.ch'
  ],
  name: 'Restaurant Name'
};
```

### **🎯 Unterstützte Restaurants**

| Restaurant | URL | Status |
|------------|-----|--------|
| **Pizzafulmine** | `pizzafulmine.kuriersoft.ch` | ✅ Konfiguriert |
| **Der Römerhof** | `roemerhof.kuriersoft.ch` | ✅ Konfiguriert |
| **Weitere** | `*.kuriersoft.ch` | ➕ Einfach hinzufügbar |

## 🧪 Entwicklung & Testing

### **Lokale Entwicklung**
```bash
# App im Simulator/Gerät testen
npm start

# Spezifische Plattform
npm run android
npm run ios
```

### **Funktionen testen**
1. **Restaurant-Website** → Lädt korrekt ohne Browser-Interface
2. **Bestellvorgang** → Funktioniert komplett in der App
3. **Payment** → Stripe/PayPal/TWINT bleiben in der App
4. **Navigation** → Hardware Back Button funktioniert
5. **Offline** → Retry-Button bei Verbindungsproblemen

## 🏗️ Production Build

### **Android APK/AAB erstellen**
```bash
# Production Build (empfohlen für Play Store)
npm run build:android

# Lokaler Build (für Testing)
npm run build:android:local
```

### **Build-Status prüfen**
```bash
# Alle Builds anzeigen
eas build:list

# Spezifischen Build herunterladen
eas build:download --id <build-id>
```

## 📱 App-Features im Detail

### **🔒 Sicherheitsfeatures**

#### **Intelligente Link-Behandlung**
- **Restaurant-URLs** → Bleiben in der App
- **Payment-Provider** → Automatisch erlaubt (Stripe, PayPal, TWINT, etc.)
- **App Store Links** → Öffnen externen Browser
- **Social Media** → Öffnen externe Apps

#### **Automatisch erlaubte Domains**
```typescript
// Automatisch in der App erlaubt:
'*.kuriersoft.ch'     // Alle Kuriersoft-Subdomains
'*.kurier.ch'         // Legacy-Domains
'checkout.stripe.com'  // Stripe Payment
'paypal.com'          // PayPal
'pay.twint.ch'        // TWINT
'postfinance.ch'      // PostFinance
// + weitere Payment-Provider
```

### **📱 Mobile Experience**

#### **SafeArea-Integration**
- **iPhone X+** → Automatische Notch-Behandlung
- **Android mit Notch** → Korrekte StatusBar-Integration  
- **Ältere Geräte** → Normale StatusBar-Behandlung
- **Tablets** → Responsive Layout

#### **Native App Look**
- **Keine URL-Leiste** sichtbar
- **Keine Browser-Navigation** 
- **StatusBar integriert** (Uhrzeit, Batterie sichtbar)
- **Zoom deaktiviert** für konsistente UX
- **Native Scrolling** und Touch-Feedback

## 🔧 Erweiterte Konfiguration

### **Neue Restaurants hinzufügen**

1. **In `config.ts` erweitern:**
```typescript
export const RESTAURANT_CONFIGS = {
  // ... bestehende
  neues_restaurant: {
    url: 'https://neues-restaurant.kuriersoft.ch/',
    allowedHosts: [
      'neues-restaurant.kuriersoft.ch',
      'www.neues-restaurant.kuriersoft.ch',
      'kuriersoft.ch',
      'www.kuriersoft.ch'
    ],
    name: 'Neues Restaurant'
  }
}
```

2. **Aktivieren:**
```typescript
const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.neues_restaurant;
```

### **App-Icons und Branding ändern**
```bash
assets/
├── icon.png           ← App-Icon (1024x1024)
├── adaptive-icon.png  ← Android Adaptive Icon
├── splash-icon.png    ← Splash Screen Icon
└── favicon.png        ← Web Favicon
```

### **App-Metadaten anpassen**
```json
// In app.json
{
  "expo": {
    "name": "Restaurant Name App",
    "slug": "restaurant-app", 
    "description": "Restaurant App für Online-Bestellungen",
    "ios": {
      "bundleIdentifier": "com.restaurant.app"
    },
    "android": {
      "package": "com.restaurant.app"
    }
  }
}
```

## 🚨 Troubleshooting

### **Häufige Probleme & Lösungen**

#### **❌ Build-Fehler**
```bash
# Cache löschen und neu installieren
rm -rf node_modules package-lock.json
npm install

# Expo Cache löschen
npx expo install --fix
```

#### **❌ Restaurant-Seite lädt nicht**
1. **URL in `config.ts` prüfen** → Vollständige HTTPS-URL?
2. **allowedHosts erweitern** → Domain in der Liste?
3. **Internet-Verbindung** → Offline-Banner sichtbar?

#### **❌ Payment öffnet Browser**
```typescript
// In config.ts allowedHosts erweitern:
allowedHosts: [
  // ... bestehende
  'checkout.stripe.com',
  'paypal.com',
  'pay.twint.ch'
]
```

#### **❌ Android Build fehlschlägt**
```bash
# EAS Build Log prüfen
eas build:list
eas build:view <build-id>

# Lokalen Build versuchen
npm run build:android:local
```

## 📋 Checkliste für neue Restaurants

### **✅ Vor dem Build**
- [ ] `config.ts` → Restaurant-URL gesetzt
- [ ] `config.ts` → allowedHosts erweitert  
- [ ] `app.json` → App-Name angepasst
- [ ] `assets/` → Icons ausgetauscht
- [ ] Testing → App im Simulator getestet

### **✅ Testing-Schritte**
1. [ ] **Restaurant-Website** lädt ohne Browser-Interface
2. [ ] **Bestellvorgang** funktioniert komplett in App
3. [ ] **Payment-Abwicklung** bleibt in der App
4. [ ] **Hardware Back Button** navigiert korrekt
5. [ ] **Offline-Modus** zeigt Retry-Button
6. [ ] **StatusBar** sichtbar mit Uhrzeit/Batterie

### **✅ Deployment**
- [ ] **EAS Build** erfolgreich
- [ ] **APK/AAB** heruntergeladen und getestet
- [ ] **Play Store** Metadaten vorbereitet
- [ ] **App Store** Assets vorbereitet (falls iOS)

## 🎯 Workflow für Restaurant-Wechsel

### **⚡ Schnell-Workflow (< 2 Minuten)**
```bash
# 1. Restaurant in config.ts ändern
const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.roemerhof;

# 2. App testen
npm start

# 3. Build erstellen
npm run build:android

# 4. Fertig! 🎉
```

## 📖 Code-Dokumentation

### **`config.ts` - Zentrale Konfiguration**
```typescript
/**
 * ZENTRALE APP-KONFIGURATION
 * Hier wird festgelegt, welche Restaurant-Website geladen wird
 * WICHTIG: Für jeden Restaurant-Wechsel nur CURRENT_RESTAURANT ändern!
 */
export interface RestaurantConfig {
  url: string;              // Restaurant-URL (vollständige HTTPS-URL)
  allowedHosts: string[];   // Erlaubte Hosts für sichere Navigation
  name: string;            // Restaurant-Name für Logging
}

const CURRENT_RESTAURANT: RestaurantConfig = {
  url: 'https://roemerhof.kuriersoft.ch/',
  allowedHosts: [
    'roemerhof.kuriersoft.ch',
    'www.roemerhof.kuriersoft.ch',
    // ... weitere erlaubte Domains
  ],
  name: 'Römerhof'
};
```

### **`App.tsx` - Haupt-App-Komponente**
```typescript
/**
 * HAUPTKOMPONENTE DER RESTAURANT-APP
 * Konfiguriert SafeArea-Behandlung und StatusBar für alle Geräte
 * WICHTIG: Diese Datei muss normalerweise NICHT geändert werden!
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* StatusBar-Konfiguration für moderne Mobile Experience */}
      <StatusBar 
        barStyle="default"
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* SafeAreaView verhindert Überlappung mit System-UI */}
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <OrderWebView
          visible={true}
          disableZoom={true}
          // Konfiguration wird automatisch aus config.ts geladen
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

### **`OrderWebView.tsx` - WebView-Komponente**
```typescript
/**
 * RESTAURANT WEBVIEW KOMPONENTE
 * Herzstück der App - bietet vollständige native App-Erfahrung
 * 
 * HAUPTFEATURES:
 * - Vollbild-WebView ohne Browser-Interface
 * - Alle Restaurant-Aktionen bleiben in der App
 * - Intelligente Link-Behandlung
 * - Automatische Konfiguration aus config.ts
 */
export default function OrderWebView({
  startUrl = config.url,              // ← Automatisch aus config.ts
  allowedHosts = config.allowedHosts, // ← Automatisch aus config.ts
  disableZoom = true,
  // ...
}: OrderWebViewProps) {
  
  // Intelligente Link-Behandlung
  const isAllowedHost = (url: string) => {
    // Restaurant-URLs → In App behalten
    // Payment-Provider → Automatisch erlaubt
    // App Store Links → Extern öffnen
  };
  
  // Native App JavaScript-Injection
  const injectedJS = useMemo(() => {
    // Entfernt Browser-UI Elemente
    // Deaktiviert Zoom für Native Look
    // Optimiert für Mobile Experience
  }, [disableZoom]);
  
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: startUrl }}
        // Alle Konfigurationen für Native App Experience
        injectedJavaScript={injectedJS}
        // ...
      />
    </View>
  );
}
```

## 📊 Dependencies & Technologie-Stack

### **Core Dependencies**
- **React Native 0.79.5** → Mobile Framework
- **Expo ~53.0.20** → Development Platform
- **TypeScript ~5.8.3** → Typsicherheit
- **react-native-webview 13.13.5** → WebView-Komponente
- **react-native-safe-area-context** → SafeArea-Behandlung
- **@react-native-community/netinfo** → Netzwerk-Status

### **Build & Deployment**
- **EAS Build** → Cloud-Build-System
- **Expo Application Services** → Distribution
- **Android Gradle** → Android-Builds
- **Xcode** → iOS-Builds (optional)

## 📖 Zusätzliche Dokumentation

- **`RESTAURANT_CONFIG.md`** → Detaillierte Konfiguration
- **`SAFEAREA_SOLUTION.md`** → SafeArea-Implementierung  
- **`IN_APP_ACTIONS.md`** → Payment & Link-Handling

---

## 🎉 Zusammenfassung

Diese App bietet eine **vollständig professionelle Lösung** für Kuriersoft-Restaurant-Apps mit:

✅ **Ein-Klick Restaurant-Konfiguration**  
✅ **Native App Experience**  
✅ **In-App Payment-Abwicklung**  
✅ **Cross-Platform Kompatibilität**  
✅ **Zukunftssichere Architektur**  

**Zeit für Restaurant-Wechsel: < 2 Minuten** 🚀
