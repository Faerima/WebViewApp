# 👨‍💻 WebViewApp - Entwickler-Übergabe

## 📋 Projektübersicht

**WebViewApp** ist eine React Native/Expo-basierte Mobile App mit WebView-Komponente für Online-Bestellungen.

### 🔧 Technische Spezifikationen
- **Framework:** React Native mit Expo SDK 53
- **Platform:** Android (iOS vorbereitet)
- **App-ID:** `ch.webviewapp`
- **Build-System:** EAS (Expo Application Services)
- **TypeScript:** Vollständig typisiert

---

## 🚀 Development Environment Setup

### Voraussetzungen
```bash
# Node.js (LTS Version)
node --version  # >= 18.x

# Expo CLI
npm install -g @expo/cli eas-cli

# EAS Account
eas login
```

### Projekt Setup
```bash
# Repository klonen
git clone <repository-url>
cd WebViewApp

# Dependencies installieren
npm install

# Development Server starten
npm start
```

### Build-Konfiguration
```bash
# EAS konfigurieren (falls nötig)
eas build:configure

# Android Build erstellen
npm run build:android

# Build Status prüfen
eas build:list
```

---

## 🏗️ Code-Architektur

### Dateistruktur
```
WebViewApp/
├── App.tsx                 # Haupt-App-Komponente
├── src/
│   └── OrderWebView.tsx    # WebView-Komponente
├── assets/                 # App-Icons & Splash
├── app.json               # Expo-Konfiguration
├── eas.json               # Build-Konfiguration
└── package.json           # Dependencies
```

### Kern-Komponenten

#### `App.tsx` - Haupt-App
```typescript
// Zentrale App-Konfiguration
<OrderWebView 
  startUrl="https://example.com/"
  allowedHosts={['example.com','www.example.com']}
/>
```

#### `src/OrderWebView.tsx` - WebView-Komponente
```typescript
interface OrderWebViewProps {
  startUrl?: string;           // Start-URL
  allowedHosts?: string[];     // Erlaubte Domains
}
```

**Features:**
- ✅ Automatisches URL-Handling
- ✅ Netzwerk-Fehlerbehandlung
- ✅ Loading-States
- ✅ Domain-Whitelist
- ✅ Back-Button-Handling

---

## ⚙️ Konfiguration & Anpassungen

### 1. URL-Konfiguration ändern

**Datei:** `App.tsx` + `src/OrderWebView.tsx`
```typescript
// In App.tsx
startUrl="https://IHRE-DOMAIN.com/"
allowedHosts={['IHRE-DOMAIN.com','www.IHRE-DOMAIN.com']}

// In src/OrderWebView.tsx  
const DEFAULT_URL = 'https://IHRE-DOMAIN.com/';
allowedHosts = ['IHRE-DOMAIN.com', 'www.IHRE-DOMAIN.com']
```

### 2. App-Identität ändern

**Datei:** `app.json`
```json
{
  "expo": {
    "name": "Ihr App Name",
    "android": {
      "package": "com.ihrefirma.appname"
    },
    "ios": {
      "bundleIdentifier": "com.ihrefirma.appname"
    }
  }
}
```

### 3. App-Icons ersetzen
```
assets/
├── icon.png           # 1024x1024px App-Icon
├── adaptive-icon.png  # 1024x1024px Android Adaptive Icon
└── splash-icon.png    # 1284x2778px Splash Screen
```

### 4. Styling anpassen

**Datei:** `src/OrderWebView.tsx`
```typescript
// Splash Screen Hintergrundfarbe
backgroundColor: '#F8E5C2'  // In app.json

// Loading-Indicator Farbe
activityIndicatorColor="#007AFF"  // In OrderWebView.tsx
```

---

## 🔨 Build & Deployment

### Lokale Builds
```bash
# Android APK (zum Testen)
eas build -p android --profile preview

# Android AAB (für Play Store)  
npm run build:android

# iOS Build (falls konfiguriert)
eas build -p ios --profile production
```

### Build-Profile (eas.json)
```json
{
  "build": {
    "production": {
      "android": { "buildType": "app-bundle" }
    },
    "preview": {
      "android": { "buildType": "apk" }
    }
  }
}
```

### Play Store Deployment
```bash
# Automatisches Upload (nach Build)
eas submit -p android --latest

# Manuelles Upload
# 1. .aab von EAS Build Dashboard herunterladen
# 2. Zu Google Play Console hochladen
```

---

## 🔐 Credentials & Sicherheit

### Android Signing
- **Keystore:** Automatisch von EAS verwaltet
- **App-ID:** `ch.webviewapp`
- **Fingerprints:** Automatisch generiert

### EAS Projekt-Verwaltung
```bash
# Credentials anzeigen
eas credentials -p android

# Projekt-Info
eas project:info

# Account wechseln
eas logout && eas login
```

---

## 📱 Testing & Debugging

### Development Testing
```bash
# Expo Go (Development)
npm start
# QR-Code scannen mit Expo Go App

# Development Build (Production-ähnlich)
eas build -p android --profile preview
```

### Production Testing
```bash
# Google Play Internal Testing
# 1. .aab zu Play Console hochladen
# 2. Internal Testing Track erstellen
# 3. Tester hinzufügen
```

### Debugging
```bash
# Metro Bundler Logs
npm start -- --verbose

# EAS Build Logs
eas build:list
# Build-ID kopieren und Logs öffnen
```

---

## 🔄 Wartung & Updates

### Version Updates
```bash
# Version in package.json erhöhen
"version": "1.1.0"

# Expo Version in app.json erhöhen  
"version": "1.1.0"

# Neuen Build erstellen
npm run build:android
```

### Dependency Updates
```bash
# Expo SDK Update
npx expo upgrade

# Einzelne Packages
npm update react-native-webview
```

### Code-Qualität
```bash
# TypeScript Check
npx tsc --noEmit

# Linting (falls konfiguriert)
npm run lint
```

---

## 🛠️ Erweiterte Anpassungen

### Neue Features hinzufügen

#### Push Notifications
```bash
# Expo Notifications installieren
npx expo install expo-notifications

# FCM Setup in app.json
"android": {
  "googleServicesFile": "./google-services.json"
}
```

#### Offline-Funktionalität
```typescript
// In OrderWebView.tsx
import NetInfo from '@react-native-community/netinfo';

// Netzwerk-Status überwachen
const [isConnected, setIsConnected] = useState(true);
```

#### Custom Headers/Authentication
```typescript
// In WebView-Komponente
source={{
  uri: url,
  headers: {
    'Authorization': 'Bearer TOKEN',
    'Custom-Header': 'Value'
  }
}}
```

---

## 📞 Support & Ressourcen

### Dokumentation
- **Expo Docs:** https://docs.expo.dev/
- **React Native WebView:** https://github.com/react-native-webview/react-native-webview
- **EAS Build:** https://docs.expo.dev/build/introduction/

### Troubleshooting

#### Häufige Probleme
```bash
# Build schlägt fehl
eas build:list  # Logs prüfen
eas credentials -p android  # Credentials prüfen

# Metro Bundler Probleme  
npx expo start --clear

# Node Modules Probleme
rm -rf node_modules package-lock.json
npm install
```

#### Performance-Optimierung
- **Bundle-Größe:** `npx expo install --fix` für optimale Versionen
- **WebView-Performance:** `androidHardwareAccelerationDisabled={false}`
- **Startup-Zeit:** Splash Screen optimieren

---

## 📋 Übergabe-Checkliste

### ✅ Code-Übergabe
- [ ] Git-Repository mit allen Commits
- [ ] Alle Dependencies installiert (`npm install`)
- [ ] Build erfolgreich (`npm run build:android`)
- [ ] TypeScript ohne Fehler (`npx tsc --noEmit`)

### ✅ Konfiguration
- [ ] EAS Account-Zugang bereitgestellt
- [ ] App-ID dokumentiert: `ch.webviewapp`
- [ ] Build-Credentials verfügbar
- [ ] URL-Konfiguration erklärt

### ✅ Dokumentation
- [ ] README.md aktuell
- [ ] Diese Entwickler-Dokumentation
- [ ] Code-Kommentare vollständig
- [ ] Build-Prozess dokumentiert

### ✅ Testing
- [ ] Development Build getestet
- [ ] Production Build (.aab) erstellt
- [ ] App-Installation verifiziert
- [ ] Core-Funktionalität getestet

---

## 🎯 Nächste Schritte für Entwickler

1. **Environment Setup** durchführen
2. **Development Build** erstellen und testen
3. **URL-Konfiguration** an Ihre Bedürfnisse anpassen
4. **App-Identität** (Name, Icons, Package-ID) ändern
5. **Production Build** erstellen
6. **Play Store** Setup (falls gewünscht)

---

**Projekt-Status:** ✅ Production-ready  
**Letzte Aktualisierung:** Januar 2025  
**Build-Version:** 1.0.0  
**App-ID:** ch.webviewapp
