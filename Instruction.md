## Abschlussbericht & Best Practices: Keystore, Build & Repo-Hygiene

### Abschlussbericht (Ist-Zustand)

1) **EAS init Problem**
   - Ursache: EAS hat ein bestehendes Projekt mit gleichem owner/slug erkannt → daher kein neues Projekt/keine neue projectId.
   - Status: Analyse abgeschlossen, Workaround/Prozess bekannt: slug anpassen und extra.eas.projectId entfernen, dann eas init → „No“ → „Create new project“.

2) **Keystore-Pfad-Problem (Windows)**
   - Ursache: Backslashes/absolute Windows-Pfade aus gradle.properties wurden nicht korrekt aufgelöst → validateSigningRelease fand die Datei nicht.
   - Fix: Pfad-Normalisierung in build.gradle (Backslashes → Slashes, File-Fallbacks), Pfad in gradle.properties angepasst (Forward Slashes/relativ). Debug-Logs eingefügt.

3) **Repo-Hygiene**
   - gradle.properties in .gitignore aufgenommen (Secrets nicht versionieren).

4) **Verifikation**
   - Lokaler Release-Build:
     ```powershell
     .\gradlew bundleRelease --stacktrace --info
     ```
   - Ergebnis: BUILD SUCCESSFUL. validateSigningRelease-Fehler behoben.

### Empfohlene Aufräumarbeiten (kurz)
- Debug-Logs aus build.gradle entfernen (Produktionsbereit).
- Keystore-Pfad final festlegen:
  - Entweder userweit (`C:/Users/<User>/.gradle/gradle.properties`) mit absolutem Pfad und Forward Slashes.
  - Oder projektrelativ, z. B. `android/app/keystores/release.jks`, und in .gitignore ausgeschlossen.
- Sicherstellen, dass gradle.properties nie committet wurde. Falls ja: Secrets aus der Git-Historie entfernen (BFG/git filter-repo).

### Finaler, robuster build.gradle-Auszug (ohne Debug-Logs)
Fügt Normalisierung + sichere Auflösung ein und verwendet Variablen aus gradle.properties oder Env-Vars.

```groovy
def propOrEnv(String name) {
  def v = project.findProperty(name)
  if (v != null && v.toString().trim()) return v.toString()
  v = System.getenv(name)
  return (v != null && v.toString().trim()) ? v.toString() : null
}

def normalizePath(String p) { p == null ? null : p.replace('\\', '/') }

def resolveKeystoreFile(String pathStr) {
  if (!pathStr) return null
  def norm = normalizePath(pathStr)
  def f1 = file(norm)
  if (f1.exists()) return f1
  def f2 = new File(norm)
  if (f2.exists()) return f2
  def f3 = new File(rootDir, norm)
  if (f3.exists()) return f3
  return null
}

def ksPath = propOrEnv('MYAPP_UPLOAD_STORE_FILE')
def ksFile = resolveKeystoreFile(ksPath)

android {
  signingConfigs {
    release {
      if (ksFile?.exists()) {
        storeFile ksFile
        storePassword propOrEnv('MYAPP_UPLOAD_STORE_PASSWORD') ?: ''
        keyAlias      propOrEnv('MYAPP_UPLOAD_KEY_ALIAS')      ?: ''
        keyPassword   propOrEnv('MYAPP_UPLOAD_KEY_PASSWORD')   ?: ''
      } else {
        logger.lifecycle("No valid keystore resolved; release build will be unsigned.")
      }
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      // minifyEnabled/proguard config nach Bedarf
    }
  }
}
```

### .gitignore-Einträge (empfohlen)
- Im Repo-Root:
  ```
  android/gradle.properties
  android/app/keystores/
  *.jks
  *.keystore
  ```
- Zusätzlich eine Beispieldatei committen:
  `android/gradle.properties.example` (ohne Passwörter)

### Nächste Schritte (kurz)
- build.gradle Debug-Logs entfernen (falls noch vorhanden).
- Keystore-Ablage final festzurren (userweit oder android/app/keystores mit .gitignore).
- EAS-Build für .aab:
  - PowerShell: `$env:EXPO_NO_VCS="1"; eas build -p android --profile production`
  - Download: `eas build:download --platform android --latest -o .\app-release.aab`
- Play Console Upload + Store-Eintrag.

**Tipp:** Diese Schritte direkt nach Projektstart umsetzen, um Pfadprobleme und versehentliches Versionieren von Secrets zu vermeiden.
# 🚀 Checkliste: Von Base-Kopie zur .aab (Android, Expo/EAS, Windows)

## 📋 Voraussetzungen (einmalig)

**EAS-CLI installiert und Login ok:**
```bash
npm i -g eas-cli
eas whoami   # ggf. 'eas login'
```

---

## 1️⃣ Projekt kopieren

- Ordner im Explorer kopieren/umbenennen (z. B. `WebViewApp` → `roemerhof`)
- **Optional:** alte Git-Remote lösen
  ```bash
  git remote -v
  git remote remove origin
  ```

---

## 2️⃣ App-Identität in app.json setzen

In `app.json` ändern:
- `expo.name` (z. B. "Römerhof")
- `slug` (z. B. "roemerhofwebview")
- `scheme` (z. B. "roemerhof")
- `android.package` (z. B. "ch.kuriersoft.roemerhof")
- `version` (z. B. "1.0.0")
- `android.versionCode` (z. B. 1; bei Updates +1)
- `icon`, `splash.image`, `splash.backgroundColor`

**Schnell-Check:**
```bash
npx expo config --type public
```

---

## 3️⃣ EAS Project ID verknüpfen

1. Falls vorhanden, alte `extra.eas.projectId` aus `app.json` entfernen
2. Neues Projekt anlegen/verknüpfen:
   ```bash
   eas init
   # Prompt "Existing project found? Link this project?" → No
   # Danach "Create a new project" wählen
   eas project:info   # neue Project ID prüfen
   Je nachdem ein neues Projekt generieren mit einem neuen Slug
   ```

---

## 4️⃣ Ziel-URL setzen

In `config.ts` die Restaurant-URL (`BASE_URL`/`startUrl`) eintragen.

> **💡 Hinweis:** Falls zusätzlich `extra.startUrl` genutzt wird: konsistent halten oder nur eine Quelle verwenden.

---

## 5️⃣ Keystore festlegen

### 🌟 Variante A — EAS Managed Credentials (empfohlen)

**Einfach und automatisch:**
- Beim ersten Build EAS den Keystore automatisch verwalten lassen
- Build starten (siehe Schritt 6) → Prompt "Let Expo handle …" mit **Yes** bestätigen

**Späteren Export/Backup (optional):**
```bash
eas credentials
# Android → Keystore → "Download" (falls nötig)
```

**✅ Vorteile:**
- Google Play App Signing ist kompatibel
- Du musst keinen eigenen .jks erzeugen oder sichern (EAS verwaltet ihn)

### 🔧 Variante B — Eigener Keystore (vollständige Kontrolle)

#### Option 1: Mit keytool (ohne Android Studio)

```powershell
# Pfade/Alias anpassen – PowerShell-Beispiel (Windows, mitgeliefertes JBR)
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkey -v `
 -keystore C:\Keys\Kuriersoft\roemerhof.jks `
 -alias roemerhof -keyalg RSA -keysize 2048 -validity 10000
```

**Eingaben:** Keystore-Passwort, Key-Alias, Key-Passwort, Gültigkeit (Jahre), Zertifikatfelder (Name/Org/Land).

#### Option 2: In Android Studio

1. Irgendein Android-Projekt öffnen (zur Not Dummy-Projekt)
2. **Build** → **Generate Signed Bundle / APK** → **Android App Bundle** → **Next**
3. **Keystore:** **Create new…** → Pfad, Passwörter, Alias, Validity, Zertifikatfelder → **OK**
4. Keystore-Datei (.jks) sicher speichern (verschlüsselt, Backups)

#### Keystore in EAS hinterlegen

```bash
eas credentials
# Android → "Provide your own keystore"
# Datei (.jks), Key-Alias, Store- und Key-Passwörter angeben
```

#### (Optional) Upload-Zertifikat für Google Play exportieren

```powershell
# PEM-Zertifikat exportieren
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -exportcert -rfc `
 -alias roemerhof `
 -file C:\Keys\Kuriersoft\upload_certificate.pem `
 -keystore C:\Keys\Kuriersoft\roemerhof.jks

# Fingerprints anzeigen (SHA-1/SHA-256)
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v `
 -keystore C:\Keys\Kuriersoft\roemerhof.jks -alias roemerhof
```

In der Play Console unter **App-Integrität** → **Upload-Schlüssel** registrieren (falls benötigt).

### 🔐 Best Practices (Wichtig!)

- ❌ `.jks` **nie** ins Git committen
- 🔒 Keystore verschlüsselt ablegen, 2 Backups (z. B. Cloud-Tresor + externe Platte)
- 🔑 Passwörter/Alias getrennt im Passwortmanager (1Password/Bitwarden/KeePass)
- 🔄 Pro App **gleicher Keystore** für Updates verwenden (sonst keine Updates möglich)

---

## 6️⃣ Produktions-Build (EAS Cloud)

### Optional: .easignore erstellen
Für kleinere Uploads:
```gitignore
node_modules
.git
.expo
*.log
android/app/build
ios/build
```

### Minimalprofil in eas.json
Im Projekt-Root:
```json
{
  "build": {
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Build starten (ohne Git)

**PowerShell:**
```powershell
$env:EXPO_NO_VCS="1"; eas build -p android --profile production
```

**CMD:**
```cmd
set EXPO_NO_VCS=1 && eas build -p android --profile production
```

---

## 7️⃣ .aab herunterladen

```bash
eas build:list
eas build:download --platform android --latest -o .\roemerhof-release.aab
```

**Alternativ:** Expo/EAS Dashboard → Projekt → Builds → Artifact Download.

---

## 🔧 Alternative: Lokaler Build (Windows)

**⚠️ Wichtiger Hinweis für Windows:** 
- Setze `newArchEnabled=false` in `android/gradle.properties`
- Das verhindert Probleme mit zu langen Dateinamen auf Windows


```bash
npx expo prebuild
cd android
.\gradlew bundleRelease
# Ergebnis: android\app\build\outputs\bundle\release\app-release.aab
```

**Für APK statt AAB:**
```bash
.\gradlew assembleRelease
# Ergebnis: android\app\build\outputs\apk\release\app-release.apk
```

Keystore in EAS hinterlegen

eas credentials
# Android → "Provide your own keystore"
# Datei (.jks), Key-Alias, Store- und Key-Passwörter angeben

(Optional) Upload-Zertifikat für Google Play exportieren
# PEM-Zertifikat exportieren
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -exportcert -rfc ^
 -alias roemerhof ^
 -file C:\Keys\Kuriersoft\upload_certificate.pem ^
 -keystore C:\Keys\Kuriersoft\roemerhof.jks

# Fingerprints anzeigen (SHA-1/SHA-256)
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v ^
 -keystore C:\Keys\Kuriersoft\roemerhof.jks -alias roemerhof


In der Play Console unter App-Integrität → Upload-Schlüssel registrieren (falls benötigt).

Best Practices (Wichtig):

.jks nie ins Git committen.
Keystore verschlüsselt ablegen, 2 Backups (z. B. Cloud-Tresor + externe Platte).
Passwörter/Alias getrennt im Passwortmanager (1Password/Bitwarden/KeePass).
Pro App gleicher Keystore für Updates verwenden (sonst keine Updates möglich).
6) Produktions-Build (EAS Cloud, ohne Git/GitHub)
Optional: .easignore (Upload kleiner halten):
node_modules
.git
.expo
*.log
android/app/build
ios/build

Minimalprofil (eas.json im Projekt-Root):
{
  "build": {
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}

Build starten (PowerShell, ohne Git):
$env:EXPO_NO_VCS="1"; eas build -p android --profile production

CMD-Variante:
set EXPO_NO_VCS=1 && eas build -p android --profile production

7) .aab herunterladen
eas build:list
eas build:download --platform android --latest -o .\roemerhof-release.aab

Alternativ: Expo/EAS Dashboard → Projekt → Builds → Artifact Download.
Alternative: Komplett lokal ohne EAS (nur wenn gewünscht)
npx expo prebuild
cd android
.\gradlew bundleRelease
# Ergebnis: android\app\build\outputs\bundle\release\app-release.aab

Häufige Probleme und Lösungen
EAS will altes Projekt verlinken
Fix: extra.eas.projectId aus app.json löschen, slug anpassen, dann:
eas init
# "No" → "Create a new project"

EAS Local Build auf Windows schlägt fehl
Ursache: Nicht unterstützt. Lösung: EAS Cloud (oben) oder lokaler Gradle-Build (Alternative).
Android Studio „Generate Signed Bundle/APK“ grau
Ursache: Kein android/-App-Modul/Gradle-Sync (Managed-Workflow). Lösung: Für EAS nicht nötig; sonst:
npx expo prebuild

„GitHub erforderlich?“
Nein. Für EAS Cloud:
$env:EXPO_NO_VCS="1"; eas build -p android --profile production

Play Console Upload-Fehler
„Package name already exists“ → android.package eindeutig setzen.
„Version code must be greater“ → android.versionCode +1 erhöhen.