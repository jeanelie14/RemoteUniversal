// Types de base pour l'application RemoteUniversal

export interface TVDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  ipAddress: string;
  isConnected: boolean;
  connectionType: 'wifi' | 'ir';
  lastUsed: string; // Changé de Date à string pour la sérialisation Redux
}

export interface IRCode {
  command: string;
  code: string;
  frequency: number;
  brand: string;
  model: string;
}

export interface TVProfile {
  id: string;
  name: string;
  device: TVDevice;
  irCodes: IRCode[];
  settings: TVSettings;
}

export interface TVSettings {
  volume: number;
  currentChannel: number;
  inputSource: string;
  isMuted: boolean;
}

export interface VoiceCommand {
  id: string;
  command: string;
  action: string;
  isActive: boolean;
}

export interface Automation {
  id: string;
  name: string;
  trigger: 'time' | 'voice' | 'gesture';
  action: string;
  isEnabled: boolean;
  schedule?: string;
}

// Types pour Redux
export interface AppState {
  tvs: TVDevice[];
  currentTV: TVDevice | null;
  profiles: TVProfile[];
  isScanning: boolean;
  isConnected: boolean;
  error: string | null;
}

// Types pour les services
export interface WiFiService {
  scanForTVs(): Promise<TVDevice[]>;
  connectToTV(device: TVDevice): Promise<boolean>;
  disconnectFromTV(): Promise<void>;
}

export interface IRService {
  sendCommand(code: string): Promise<boolean>;
  learnCommand(): Promise<string>;
  getAvailableCodes(brand: string, model: string): Promise<IRCode[]>;
}

export interface VoiceService {
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  processCommand(command: string): Promise<boolean>;
}
