# 🔧 API Reference - RemoteUniversal

## 📋 Table des Matières

- [Services](#services)
- [Composants](#composants)
- [Types](#types)
- [Redux Store](#redux-store)
- [Navigation](#navigation)
- [Configuration](#configuration)

---

## 🛠️ Services

### WiFiService

Service pour la découverte et le contrôle des TVs via WiFi.

```typescript
class WiFiService {
  static getInstance(): WiFiService
  initialize(): Promise<boolean>
  scanForTVs(): Promise<TVDevice[]>
  connectToTV(device: TVDevice): Promise<boolean>
  sendCommand(command: string, params?: any): Promise<boolean>
  disconnectFromTV(): Promise<boolean>
}
```

#### Méthodes

**`scanForTVs()`**
- **Description** : Scanne le réseau pour détecter les TVs connectées
- **Retour** : `Promise<TVDevice[]>` - Liste des TVs détectées
- **Exemple** :
```typescript
const wifiService = WiFiService.getInstance();
const tvs = await wifiService.scanForTVs();
console.log(`Trouvé ${tvs.length} TVs`);
```

**`connectToTV(device)`**
- **Description** : Établit une connexion avec une TV
- **Paramètres** : `device: TVDevice` - Device à connecter
- **Retour** : `Promise<boolean>` - Succès de la connexion
- **Exemple** :
```typescript
const connected = await wifiService.connectToTV(selectedTV);
if (connected) {
  console.log('Connexion réussie');
}
```

**`sendCommand(command, params)`**
- **Description** : Envoie une commande à la TV connectée
- **Paramètres** : 
  - `command: string` - Commande à envoyer
  - `params?: any` - Paramètres optionnels
- **Retour** : `Promise<boolean>` - Succès de l'envoi
- **Exemple** :
```typescript
await wifiService.sendCommand('power', { state: true });
await wifiService.sendCommand('volume_up');
```

### IRService

Service pour le contrôle des TVs via infrarouge.

```typescript
class IRService {
  static getInstance(): IRService
  initialize(): Promise<boolean>
  sendCommand(command: string): Promise<boolean>
  learnCommand(): Promise<string>
  getAvailableCodes(brand: string, model: string): Promise<IRCode[]>
}
```

#### Méthodes

**`sendCommand(command)`**
- **Description** : Envoie une commande IR à la TV
- **Paramètres** : `command: string` - Commande IR à envoyer
- **Retour** : `Promise<boolean>` - Succès de l'envoi
- **Exemple** :
```typescript
const irService = IRService.getInstance();
await irService.sendCommand('power');
await irService.sendCommand('volume_up');
```

**`learnCommand()`**
- **Description** : Apprend une nouvelle commande IR
- **Retour** : `Promise<string>` - Code IR appris
- **Exemple** :
```typescript
const code = await irService.learnCommand();
console.log('Code appris:', code);
```

### VoiceService

Service pour la reconnaissance et le traitement des commandes vocales.

```typescript
class VoiceService {
  static getInstance(): VoiceService
  initialize(): Promise<boolean>
  startListening(): Promise<void>
  stopListening(): Promise<void>
  processCommand(command: string): Promise<boolean>
  setCommandCallback(callback: (command: string) => void): void
  addCustomCommand(voiceCommand: VoiceCommand): void
  removeCommand(commandId: string): void
  toggleCommand(commandId: string, isActive: boolean): void
  isCurrentlyListening(): boolean
  getAvailableCommands(): VoiceCommand[]
  cleanup(): Promise<void>
}
```

#### Méthodes

**`startListening()`**
- **Description** : Démarre l'écoute vocale
- **Retour** : `Promise<void>`
- **Exemple** :
```typescript
const voiceService = VoiceService.getInstance();
await voiceService.startListening();
```

**`processCommand(command)`**
- **Description** : Traite une commande vocale reconnue
- **Paramètres** : `command: string` - Commande vocale
- **Retour** : `Promise<boolean>` - Succès du traitement
- **Exemple** :
```typescript
const success = await voiceService.processCommand('allume la télé');
if (success) {
  console.log('Commande exécutée');
}
```

### AutomationService

Service pour la gestion des automatisations.

```typescript
class AutomationService {
  static getInstance(): AutomationService
  initialize(): Promise<boolean>
  createAutomation(automation: Omit<Automation, 'id'>): Promise<Automation>
  updateAutomation(automation: Automation): Promise<boolean>
  deleteAutomation(automationId: string): Promise<boolean>
  toggleAutomation(automationId: string, isEnabled: boolean): Promise<boolean>
  executeAutomation(automation: Automation): Promise<boolean>
  getAutomations(): Automation[]
  getActiveAutomations(): Automation[]
  cleanup(): Promise<void>
}
```

#### Méthodes

**`createAutomation(automation)`**
- **Description** : Crée une nouvelle automatisation
- **Paramètres** : `automation: Omit<Automation, 'id'>` - Données de l'automatisation
- **Retour** : `Promise<Automation>` - Automatisation créée
- **Exemple** :
```typescript
const automation = await automationService.createAutomation({
  name: 'Allumage matinal',
  trigger: 'time',
  action: 'power_on',
  schedule: '07:00',
  isEnabled: true
});
```

**`toggleAutomation(automationId, isEnabled)`**
- **Description** : Active/désactive une automatisation
- **Paramètres** : 
  - `automationId: string` - ID de l'automatisation
  - `isEnabled: boolean` - État souhaité
- **Retour** : `Promise<boolean>` - Succès de la modification
- **Exemple** :
```typescript
await automationService.toggleAutomation('auto-1', false);
```

---

## 🧩 Composants

### ButtonPower

Bouton principal pour allumer/éteindre la TV.

```typescript
interface ButtonPowerProps {
  isTVOn: boolean;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

<ButtonPower 
  isTVOn={false}
  onPress={handlePowerToggle}
  disabled={false}
  loading={false}
/>
```

#### Props

- **`isTVOn`** : `boolean` - État de la TV (allumée/éteinte)
- **`onPress`** : `() => void` - Callback appelé au clic
- **`disabled`** : `boolean?` - Désactive le bouton
- **`loading`** : `boolean?` - Affiche un indicateur de chargement

### Trackpad

Trackpad virtuel pour la navigation.

```typescript
interface TrackpadProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

<Trackpad
  onSwipeUp={handleSwipeUp}
  onSwipeDown={handleSwipeDown}
  onSwipeLeft={handleSwipeLeft}
  onSwipeRight={handleSwipeRight}
  onTap={handleTap}
  onLongPress={handleLongPress}
  disabled={false}
/>
```

#### Props

- **`onSwipeUp`** : `() => void?` - Callback pour swipe vers le haut
- **`onSwipeDown`** : `() => void?` - Callback pour swipe vers le bas
- **`onSwipeLeft`** : `() => void?` - Callback pour swipe vers la gauche
- **`onSwipeRight`** : `() => void?` - Callback pour swipe vers la droite
- **`onTap`** : `() => void?` - Callback pour tap simple
- **`onLongPress`** : `() => void?` - Callback pour appui long
- **`disabled`** : `boolean?` - Désactive le trackpad

### VoiceControl

Composant pour le contrôle vocal.

```typescript
interface VoiceControlProps {
  onCommandRecognized: (command: string) => void;
  disabled?: boolean;
}

<VoiceControl
  onCommandRecognized={handleVoiceCommand}
  disabled={false}
/>
```

#### Props

- **`onCommandRecognized`** : `(command: string) => void` - Callback pour commande reconnue
- **`disabled`** : `boolean?` - Désactive le contrôle vocal

---

## 📝 Types

### TVDevice

```typescript
interface TVDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  ipAddress: string;
  connectionType: 'wifi' | 'ir';
  isConnected: boolean;
  lastUsed: string;
}
```

### VoiceCommand

```typescript
interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  isActive: boolean;
}
```

### Automation

```typescript
interface Automation {
  id: string;
  name: string;
  trigger: 'time' | 'voice' | 'gesture';
  action: string;
  isEnabled: boolean;
  schedule?: string;
}
```

### IRCode

```typescript
interface IRCode {
  command: string;
  code: string;
  frequency: number;
  brand: string;
  model: string;
}
```

---

## 🗄️ Redux Store

### État Global

```typescript
interface RootState {
  tv: {
    devices: TVDevice[];
    selectedDevice: TVDevice | null;
    isScanning: boolean;
    error: string | null;
  };
  profile: {
    profiles: TVProfile[];
    currentProfile: TVProfile | null;
  };
}
```

### Actions TV

```typescript
// Actions synchrones
startScanning()
setDevices(devices: TVDevice[])
setError(error: string | null)
selectDevice(device: TVDevice)

// Actions asynchrones
scanForTVs()
connectToTV(device: TVDevice)
sendCommand(command: string, params?: any)
```

### Actions Profile

```typescript
// Actions synchrones
setProfiles(profiles: TVProfile[])
setCurrentProfile(profile: TVProfile | null)
addProfile(profile: TVProfile)
updateProfile(profile: TVProfile)
removeProfile(profileId: string)

// Actions asynchrones
loadProfiles()
saveProfile(profile: TVProfile)
```

---

## 🧭 Navigation

### Stack Navigator

```typescript
type RootStackParamList = {
  Home: undefined;
  Control: { selectedTV: TVDevice };
  Automation: undefined;
};
```

### Navigation Hooks

```typescript
// Dans un composant
const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'Control'>>();

// Navigation
navigation.navigate('Control', { selectedTV: tv });
navigation.goBack();
```

---

## ⚙️ Configuration

### Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "android", "ios"]
}
```

---

## 🚀 Scripts Disponibles

```bash
# Développement
npm start              # Démarrer Expo
npm run android        # Build Android
npm run ios           # Build iOS
npm run web           # Démarrer web

# Tests
npm test              # Lancer les tests
npm run test:watch    # Tests en mode watch
npm run test:coverage # Tests avec couverture
npm run test:ci       # Tests pour CI/CD

# Build
npm run build:android # Build production Android
npm run build:ios     # Build production iOS
```

---

## 📚 Ressources

- **Documentation Expo** : https://docs.expo.dev/
- **React Navigation** : https://reactnavigation.org/
- **Redux Toolkit** : https://redux-toolkit.js.org/
- **Jest** : https://jestjs.io/
- **TypeScript** : https://www.typescriptlang.org/

---

**RemoteUniversal API** - Documentation technique complète 🔧📚
