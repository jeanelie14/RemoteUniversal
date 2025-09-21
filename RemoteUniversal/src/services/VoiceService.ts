import * as Speech from 'expo-speech';
import { VoiceCommand } from '../types';

export class VoiceService {
  private static instance: VoiceService;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];
  private onCommandRecognized?: (command: string) => void;

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Initialise le service vocal
   */
  public async initialize(): Promise<boolean> {
    try {
      // Chargement des commandes vocales prédéfinies
      await this.loadVoiceCommands();
      
      console.log('Service vocal initialisé (expo-speech)');
      return true;
    } catch (error) {
      console.error('Erreur initialisation service vocal:', error);
      return false;
    }
  }

  /**
   * Démarre l'écoute vocale (simulation avec expo-speech)
   */
  public async startListening(): Promise<void> {
    try {
      if (this.isListening) {
        console.log('Écoute déjà en cours');
        return;
      }

      // Simulation d'écoute vocale avec expo-speech
      this.isListening = true;
      console.log('Écoute vocale démarrée (simulation)');
      
      // Simuler une commande après 2 secondes
      setTimeout(() => {
        this.simulateVoiceCommand();
      }, 2000);
    } catch (error) {
      console.error('Erreur démarrage écoute:', error);
      throw error;
    }
  }

  /**
   * Arrête l'écoute vocale
   */
  public async stopListening(): Promise<void> {
    try {
      if (!this.isListening) {
        console.log('Aucune écoute en cours');
        return;
      }

      this.isListening = false;
      console.log('Écoute vocale arrêtée');
    } catch (error) {
      console.error('Erreur arrêt écoute:', error);
      throw error;
    }
  }

  /**
   * Traite une commande vocale reconnue
   */
  public async processCommand(command: string): Promise<boolean> {
    try {
      const normalizedCommand = command.toLowerCase().trim();
      console.log('Commande vocale reconnue:', normalizedCommand);

      // Recherche de la commande correspondante
      const voiceCommand = this.commands.find(cmd => 
        cmd.command.toLowerCase() === normalizedCommand && cmd.isActive
      );

      if (voiceCommand) {
        console.log('Exécution commande:', voiceCommand.action);
        
        // Notifier l'écran de contrôle
        if (this.onCommandRecognized) {
          this.onCommandRecognized(voiceCommand.action);
        }
        
        return true;
      } else {
        console.log('Commande non reconnue:', normalizedCommand);
        return false;
      }
    } catch (error) {
      console.error('Erreur traitement commande:', error);
      return false;
    }
  }

  /**
   * Définit le callback pour les commandes reconnues
   */
  public setCommandCallback(callback: (command: string) => void): void {
    this.onCommandRecognized = callback;
  }

  /**
   * Charge les commandes vocales prédéfinies
   */
  private async loadVoiceCommands(): Promise<void> {
    this.commands = [
      {
        id: 'power-on',
        command: 'allume la télé',
        action: 'power_on',
        isActive: true
      },
      {
        id: 'power-off',
        command: 'éteint la télé',
        action: 'power_off',
        isActive: true
      },
      {
        id: 'volume-up',
        command: 'augmente le volume',
        action: 'volume_up',
        isActive: true
      },
      {
        id: 'volume-down',
        command: 'diminue le volume',
        action: 'volume_down',
        isActive: true
      },
      {
        id: 'mute',
        command: 'coupe le son',
        action: 'mute',
        isActive: true
      },
      {
        id: 'unmute',
        command: 'remet le son',
        action: 'unmute',
        isActive: true
      },
      {
        id: 'channel-up',
        command: 'chaîne suivante',
        action: 'channel_up',
        isActive: true
      },
      {
        id: 'channel-down',
        command: 'chaîne précédente',
        action: 'channel_down',
        isActive: true
      },
      {
        id: 'ok',
        command: 'valide',
        action: 'ok',
        isActive: true
      }
    ];

    console.log('Commandes vocales chargées:', this.commands.length);
  }

  /**
   * Ajoute une commande vocale personnalisée
   */
  public addCustomCommand(voiceCommand: VoiceCommand): void {
    this.commands.push(voiceCommand);
    console.log('Commande personnalisée ajoutée:', voiceCommand.command);
  }

  /**
   * Supprime une commande vocale
   */
  public removeCommand(commandId: string): void {
    this.commands = this.commands.filter(cmd => cmd.id !== commandId);
    console.log('Commande supprimée:', commandId);
  }

  /**
   * Active/désactive une commande
   */
  public toggleCommand(commandId: string, isActive: boolean): void {
    const command = this.commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.isActive = isActive;
      console.log('Commande modifiée:', commandId, isActive);
    }
  }

  /**
   * Vérifie si l'écoute est en cours
   */
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Obtient la liste des commandes disponibles
   */
  public getAvailableCommands(): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.isActive);
  }

  /**
   * Simule une commande vocale pour la démonstration
   */
  private simulateVoiceCommand(): void {
    if (!this.isListening) return;

    const commands = ['allume la télé', 'augmente le volume', 'chaîne suivante', 'coupe le son'];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    
    console.log('Commande vocale simulée:', randomCommand);
    this.processCommand(randomCommand);
    this.isListening = false;
  }

  /**
   * Nettoie les ressources
   */
  public async cleanup(): Promise<void> {
    try {
      this.isListening = false;
      this.onCommandRecognized = undefined;
      console.log('Service vocal nettoyé');
    } catch (error) {
      console.error('Erreur nettoyage service vocal:', error);
    }
  }
}
