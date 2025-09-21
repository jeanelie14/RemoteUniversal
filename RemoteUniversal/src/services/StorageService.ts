import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { TVProfile, TVDevice, IRCode } from '../types';

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Clés de stockage
  private readonly KEYS = {
    PROFILES: 'tv_profiles',
    DEVICES: 'tv_devices',
    IR_CODES: 'ir_codes',
    SETTINGS: 'app_settings',
    CURRENT_DEVICE: 'current_device',
  };

  /**
   * Sauvegarde les profils TV
   */
  public async saveProfiles(profiles: TVProfile[]): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(profiles);
      await AsyncStorage.setItem(this.KEYS.PROFILES, jsonData);
      console.log('Profils TV sauvegardés:', profiles.length);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde profils:', error);
      return false;
    }
  }

  /**
   * Charge les profils TV
   */
  public async loadProfiles(): Promise<TVProfile[]> {
    try {
      const jsonData = await AsyncStorage.getItem(this.KEYS.PROFILES);
      if (jsonData) {
        const profiles = JSON.parse(jsonData);
        console.log('Profils TV chargés:', profiles.length);
        return profiles;
      }
      return [];
    } catch (error) {
      console.error('Erreur chargement profils:', error);
      return [];
    }
  }

  /**
   * Sauvegarde un profil TV
   */
  public async saveProfile(profile: TVProfile): Promise<boolean> {
    try {
      const profiles = await this.loadProfiles();
      const existingIndex = profiles.findIndex(p => p.id === profile.id);
      
      if (existingIndex >= 0) {
        profiles[existingIndex] = profile;
      } else {
        profiles.push(profile);
      }
      
      return await this.saveProfiles(profiles);
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      return false;
    }
  }

  /**
   * Supprime un profil TV
   */
  public async deleteProfile(profileId: string): Promise<boolean> {
    try {
      const profiles = await this.loadProfiles();
      const filteredProfiles = profiles.filter(p => p.id !== profileId);
      return await this.saveProfiles(filteredProfiles);
    } catch (error) {
      console.error('Erreur suppression profil:', error);
      return false;
    }
  }

  /**
   * Sauvegarde les appareils TV découverts
   */
  public async saveDevices(devices: TVDevice[]): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(devices);
      await AsyncStorage.setItem(this.KEYS.DEVICES, jsonData);
      console.log('Appareils TV sauvegardés:', devices.length);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde appareils:', error);
      return false;
    }
  }

  /**
   * Charge les appareils TV
   */
  public async loadDevices(): Promise<TVDevice[]> {
    try {
      const jsonData = await AsyncStorage.getItem(this.KEYS.DEVICES);
      if (jsonData) {
        const devices = JSON.parse(jsonData);
        console.log('Appareils TV chargés:', devices.length);
        return devices;
      }
      return [];
    } catch (error) {
      console.error('Erreur chargement appareils:', error);
      return [];
    }
  }

  /**
   * Sauvegarde l'appareil actuellement connecté
   */
  public async saveCurrentDevice(device: TVDevice | null): Promise<boolean> {
    try {
      if (device) {
        const jsonData = JSON.stringify(device);
        await AsyncStorage.setItem(this.KEYS.CURRENT_DEVICE, jsonData);
        console.log('Appareil actuel sauvegardé:', device.name);
      } else {
        await AsyncStorage.removeItem(this.KEYS.CURRENT_DEVICE);
        console.log('Appareil actuel supprimé');
      }
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde appareil actuel:', error);
      return false;
    }
  }

  /**
   * Charge l'appareil actuellement connecté
   */
  public async loadCurrentDevice(): Promise<TVDevice | null> {
    try {
      const jsonData = await AsyncStorage.getItem(this.KEYS.CURRENT_DEVICE);
      if (jsonData) {
        const device = JSON.parse(jsonData);
        console.log('Appareil actuel chargé:', device.name);
        return device;
      }
      return null;
    } catch (error) {
      console.error('Erreur chargement appareil actuel:', error);
      return null;
    }
  }

  /**
   * Sauvegarde les codes IR
   */
  public async saveIRCodes(codes: IRCode[]): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(codes);
      await SecureStore.setItemAsync(this.KEYS.IR_CODES, jsonData);
      console.log('Codes IR sauvegardés:', codes.length);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde codes IR:', error);
      return false;
    }
  }

  /**
   * Charge les codes IR
   */
  public async loadIRCodes(): Promise<IRCode[]> {
    try {
      const jsonData = await SecureStore.getItemAsync(this.KEYS.IR_CODES);
      if (jsonData) {
        const codes = JSON.parse(jsonData);
        console.log('Codes IR chargés:', codes.length);
        return codes;
      }
      return [];
    } catch (error) {
      console.error('Erreur chargement codes IR:', error);
      return [];
    }
  }

  /**
   * Sauvegarde les paramètres de l'application
   */
  public async saveSettings(settings: any): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(settings);
      await AsyncStorage.setItem(this.KEYS.SETTINGS, jsonData);
      console.log('Paramètres sauvegardés');
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
      return false;
    }
  }

  /**
   * Charge les paramètres de l'application
   */
  public async loadSettings(): Promise<any> {
    try {
      const jsonData = await AsyncStorage.getItem(this.KEYS.SETTINGS);
      if (jsonData) {
        const settings = JSON.parse(jsonData);
        console.log('Paramètres chargés');
        return settings;
      }
      return {};
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      return {};
    }
  }

  /**
   * Supprime toutes les données
   */
  public async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.PROFILES,
        this.KEYS.DEVICES,
        this.KEYS.CURRENT_DEVICE,
        this.KEYS.SETTINGS,
      ]);
      
      await SecureStore.deleteItemAsync(this.KEYS.IR_CODES);
      
      console.log('Toutes les données supprimées');
      return true;
    } catch (error) {
      console.error('Erreur suppression données:', error);
      return false;
    }
  }
}
