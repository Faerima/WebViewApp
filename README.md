# WebViewApp - React Native WebView für Online-Bestellungen

Eine vollständig konfigurierte React Native/Expo App mit WebView-Komponente für Online-Bestellungen.

## 🚀 Features

### Core Features
- **Wiederverwendbare WebView-Komponente** (`OrderWebView.tsx`)
- **Host-Whitelist** für sichere Navigation
- **Externe Links** öffnen automatisch im Systembrowser
- **Session/Cookie-Management** für persistente Logins
- **EAS Build** Konfiguration für `.aab` Erstellung

### UX/UI Features
- **Direkter App-Start** zur konfigurierten URL (kein Startscreen)
- **Dynamic Light/Dark Mode** Support mit automatischer StatusBar-Anpassung
- **Pull-to-Refresh** Funktionalität
- **Hardware Back Button** Navigation (Android)
- **Offline-Erkennung** mit Retry-Funktion
- **Zoom-Deaktivierung** für mobile Optimierung
- **Event-Callbacks** für Navigation und Messages

### Technical Features
- **SafeAreaView** mit korrekten Insets für Notch/StatusBar
- **Edge-to-Edge** deaktiviert um UI-Überlappungen zu vermeiden
- **StatusBar** explizit konfiguriert mit `translucent: false`
- **Platform-spezifisches Padding** als Fallback für Android
- **Automatische Theme-Erkennung** mit `useColorScheme`

## 📋 Voraussetzungen (einmalig)

- **Node.js** 18–20
- **npm** oder **yarn**
- **Git** installiert
- **Expo/EAS Account** erstellen
- **EAS CLI** installieren: `npm i -g eas-cli`
- (Optional) **Android Studio** nur für lokale Builds

## 🛠️ Setup & Installation

### 1. Repository klonen/herunterladen
```bash
git clone <repository-url>
cd WebViewApp
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Expo Development Server starten
```bash
npm start
# oder
npx expo start
```

### 4. App testen
- **QR-Code** mit Expo Go App (iOS/Android) scannen
- **Oder** Simulator: `npm run android` / `npm run ios`

## 🏗️ Build-Prozess (.aab für Play Store)

### 1. EAS Login & Konfiguration
```bash
eas login
npm run build:configure
```

### 2. Android App Bundle (.aab) erstellen
```bash
# Cloud Build (empfohlen)
npm run build:android

# Lokaler Build (benötigt Android SDK)
npm run build:android:local
```

### 3. Keystore Management
```bash
# Keystore-Informationen anzeigen
npm run credentials

# Keystore herunterladen und sicher ablegen
eas credentials -p android
# → Keystore: Manage everything...
# → Download Keystore
# → Datei als "webviewapp-keystore.jks" speichern
```

#### ⚠️ KRITISCH: Keystore Backup
- **Keystore-Datei**: `webviewapp-keystore.jks` sicher ablegen
- **Passwort**: Im Passwort-Manager speichern
- **Backup**: Mehrere Kopien an verschiedenen Orten
- **Package**: `ch.webviewapp`
- **SHA1**: `51:92:8E:42:06:38:A0:C1:F4:14:B2:D5:93:FD:BA:2E:01:61:99:CA`

**OHNE KEYSTORE = KEINE PLAY STORE UPDATES MÖGLICH!**

### 4. Build herunterladen
- **EAS Dashboard**: https://expo.dev/accounts/[username]/projects/webviewapp/builds
- `.aab` Datei herunterladen für Play Console Upload

### 5. Aktueller Build-Status (Beispiel)
```
Build ID: 5047156c-9307-4040-9b52-6c01f10a0ac3
Status: ✅ FINISHED
Platform: Android
Version: 1.0.0
Build-Zeit: ~8 Minuten
Download: https://expo.dev/artifacts/eas/aUXqVcbfbvbihN1KF3RdxD.aab
```

## 📱 Testing der .aab Datei

### Google Play Console Internal Testing (EMPFOHLEN)
1. **Play Console**: https://play.google.com/console/
2. **Create app** → App-Details eingeben
3. **Testing → Internal testing** → **Create new release**
4. **.aab Datei hochladen** → **Release erstellen**
5. **Tester hinzufügen** (eigene E-Mail)
6. **Testing-Link** erhalten und App testen

### Lokales Testing mit bundletool
```bash
# Bundletool herunterladen
curl -L -o bundletool.jar https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar

# APKs generieren
java -jar bundletool.jar build-apks --bundle=webviewapp.aab --output=webviewapp.apks

# Auf Gerät installieren
java -jar bundletool.jar install-apks --apks=webviewapp.apks
```

## 🔧 Implementierte Verbesserungen

### Version 2.0 - UX/UI Optimierungen
1. **Direkter App-Start** - Entfernung des Startscreens für sofortigen Zugang
2. **Dismiss-Gesten** - Hardware Back Button und Pull-to-Refresh implementiert
3. **Edge-to-Edge Fix** - StatusBar-Überlappung behoben
4. **Dynamic Light/Dark Mode** - Automatische Theme-Anpassung der StatusBar
5. **Code-Optimierung** - Alle Logs entfernt, englische Kommentare

### Technische Fixes
- **SafeAreaView Struktur** vereinfacht um Konflikte zu vermeiden
- **StatusBar-Komponente** explizit hinzugefügt mit `translucent: false`
- **Platform-spezifisches Padding** für Android `StatusBar.currentHeight`
- **app.json Konfiguration** für `edgeToEdgeEnabled: false`
- **WebView decelerationRate** Fehler behoben (String → Number)

## 📱 Qualitätssicherung (QA-Checkliste)

Vor der Veröffentlichung testen:

### Basis-Funktionalität
- ✅ App öffnet **konfigurierte URL**
- ✅ Navigation innerhalb erlaubter Hosts funktioniert
- ✅ Externe Links öffnen sich im **Systembrowser**
- ✅ **Session/Login** bleiben erhalten nach App-Restart
- ✅ **Warenkorb** und **Checkout-Prozess** funktional

### UX/UI Tests
- ✅ **Direkter Start** zur Website (kein Startscreen)
- ✅ **StatusBar sichtbar** - Zeit, Batterie nicht überdeckt
- ✅ **Hardware Back Button** funktioniert für WebView-Navigation
- ✅ **Pull-to-Refresh** funktioniert
- ✅ **Light/Dark Mode** StatusBar passt sich automatisch an
- ✅ **Offline-Hinweis** erscheint (Flugmodus testen)

### Build & Deployment
- ✅ **Splash Screen** und **App Icon** sichtbar
- ✅ `.aab` lässt sich in **Play Console → Internal testing** hochladen

## 🔧 Komponenten-Übersicht

### `src/OrderWebView.tsx`
Wiederverwendbare WebView-Komponente mit folgenden Props:

```typescript
type OrderWebViewProps = {
  visible: boolean;                    // Component visibility
  onClose: () => void;                 // Close callback (unused in direct mode)
  startUrl?: string;                   // Start URL (default: example.com)
  allowedHosts?: string[];             // Allowed hosts (default: example.com)
  disableZoom?: boolean;               // Disable zoom (default: true)
  onEvent?: (e: {type: string; payload?: any}) => void;  // Event callbacks
};
```

**Features:**
- Dynamic Light/Dark Mode support with `useColorScheme`
- Hardware back button navigation (Android)
- Pull-to-refresh functionality
- Offline detection with retry
- External link handling (opens in system browser)
- Host whitelist security
- Cookie/session management
- Zoom disable for mobile optimization

### `App.tsx`
Main app component that launches OrderWebView directly without start screen.
- Dynamic background color based on system theme
- Simplified structure for better performance

## 🔄 Wiederverwendung

### In anderen React Native Apps:
1. `src/OrderWebView.tsx` kopieren
2. Dependencies installieren: `react-native-webview`, `@react-native-community/netinfo`
3. Komponente importieren und verwenden

### Als NPM Package:
```bash
# Komponente als eigenständiges Package extrahieren
npm init
npm publish
```

## 🐛 Troubleshooting

### Login/Session Probleme
**Problem**: Login geht nach App-Restart verloren  
**Lösung**: Web-Server Cookies auf `SameSite=None; Secure` konfigurieren

### Payment/Checkout blockiert
**Problem**: Payment-Provider wird blockiert  
**Lösung**: Bereits implementiert - externe Payment-Links öffnen automatisch im Systembrowser

### App Store Rejection (iOS)
**Problem**: "Nur WebView" Apps werden abgelehnt  
**Lösung**: Native Features hinzufügen (Kontakt-Screen, Push-Notifications, etc.)

### Build-Fehler
**Problem**: EAS Build schlägt fehl  
**Lösung**: 
- `eas-cli` aktualisieren: `npm i -g eas-cli@latest`
- Node.js Version prüfen (18-20 unterstützt)
- Keystore-Probleme: `eas credentials -p android`

## 📂 Projektstruktur

```
WebViewApp/
├── assets/                 # App Icons & Splash Screens
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── src/
│   └── OrderWebView.tsx    # Wiederverwendbare WebView-Komponente
├── App.tsx                 # Demo-Einbindung
├── app.json                # Expo-Konfiguration
├── eas.json                # Build-Profile
├── package.json            # Dependencies & Scripts
└── README.md               # Diese Dokumentation
```

## 🔗 Wichtige Links

- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **React Native WebView**: https://github.com/react-native-webview/react-native-webview
- **Play Console**: https://play.google.com/console/

## 📝 Scripts Übersicht

```bash
npm start                    # Expo Development Server
npm run android              # Android Simulator
npm run ios                  # iOS Simulator  
npm run web                  # Web Development

npm run build:android        # EAS Cloud Build (.aab)
npm run build:android:local  # Lokaler Build
npm run build:configure     # EAS Build Setup
npm run credentials          # Keystore Management
```

## 🤝 Handover & Deployment

### Für Entwickler:
1. **Git Repository** oder **ZIP ohne node_modules** bereitstellen
2. **README.md** und **QA-Checkliste** befolgen
3. **Keystore sicher ablegen** (Passwort-Manager)

### Für Play Store:
1. **`.aab` Datei** aus EAS Dashboard herunterladen
2. **Play Console → Internal testing** hochladen
3. **QA-Checkliste** durchführen vor Veröffentlichung

---

**Erstellt für**: Online-Bestellungen  
**URL**: Konfigurierbar  
**Build-Target**: Android App Bundle (.aab)  
**Framework**: React Native + Expo Managed Workflow
