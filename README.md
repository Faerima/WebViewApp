# WebViewApp - Restaurant App Template

Ein wiederverwendbares Template für Restaurant-Apps basierend auf React Native und Expo.

## 🚀 Schnellstart

### 1. Projekt kopieren
```bash
# Den gesamten WebViewApp Ordner kopieren
cp -r WebViewApp NeueRestaurantApp
cd NeueRestaurantApp
```

### 2. Restaurant konfigurieren
Öffne `config.ts` und ändere nur diese eine Zeile:
```typescript
const RESTAURANT_URL = 'https://dein-restaurant.kuriersoft.ch/';
```

### 3. Projekt umbenennen
```bash
# Projekt-Ordner umbenennen
mv NeueRestaurantApp MeinRestaurantApp

# In package.json den Namen ändern
# "name": "mein-restaurant-app"
```

### 4. Abhängigkeiten installieren
```bash
npm install
```

### 5. App starten
```bash
# Für Entwicklung
npm start

# Für Produktion bauen
npm run build
```

## 📱 Features

- ✅ Native App Experience mit SafeArea-Unterstützung
- ✅ Intelligente Link-Verarbeitung (in-App vs. externer Browser)
- ✅ Automatische Payment-Provider-Unterstützung
- ✅ Dark Mode kompatibel
- ✅ Offline-Erkennung
- ✅ Responsive Design

## 🔧 Technologie-Stack

- **React Native 0.79.5**
- **Expo ~53.0.20**
- **TypeScript ~5.8.3**
- **WebView für Restaurant-Integration**
- **SafeArea für alle Geräte**

## 📋 Voraussetzungen

- Node.js 18+
- Expo CLI
- iOS Simulator oder Android Emulator

## 🏗️ Architektur

```
WebViewApp/
├── config.ts          # Restaurant-Konfiguration (NUR URL ÄNDERN!)
├── App.tsx           # Haupt-App mit SafeArea
├── OrderWebView.tsx  # WebView-Komponente
└── assets/           # App-Icons und Splash-Screens
```

## 🔒 Sicherheit

Die App verwendet eine Whitelist-basierte Navigation:
- ✅ Erlaubte Domains bleiben in der App
- ❌ Nicht erlaubte Domains öffnen externen Browser
- 🔄 Automatische Payment-Provider-Erkennung

## 📞 Support

Bei Problemen:
1. Überprüfe die `config.ts` - nur die URL muss geändert werden
2. Stelle sicher, dass die Restaurant-URL mit `https://` beginnt
3. Teste die App im Development-Modus

## 📝 Lizenz

Dieses Template ist für kommerzielle Restaurant-Apps gedacht.
