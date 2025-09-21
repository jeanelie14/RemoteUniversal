import * as Notifications from 'expo-notifications';
import { Automation } from '../types';
import { StorageService } from './StorageService';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class AutomationService {
  private static instance: AutomationService;
  private automations: Automation[] = [];
  private storageService: StorageService;

  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  /**
   * Initialise le service d'automatisation
   */
  public async initialize(): Promise<boolean> {
    try {
      // Demander les permissions de notification
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissions de notification refusées');
        return false;
      }

      // Charger les automatisations sauvegardées
      await this.loadAutomations();
      
      console.log('Service d\'automatisation initialisé');
      return true;
    } catch (error) {
      console.error('Erreur initialisation automatisation:', error);
      return false;
    }
  }

  /**
   * Crée une nouvelle automatisation
   */
  public async createAutomation(automation: Omit<Automation, 'id'>): Promise<Automation> {
    try {
      const newAutomation: Automation = {
        ...automation,
        id: Date.now().toString(),
      };

      this.automations.push(newAutomation);
      await this.saveAutomations();

      // Programmer la notification si c'est une automatisation temporelle
      if (automation.trigger === 'time' && automation.schedule) {
        await this.scheduleNotification(newAutomation);
      }

      console.log('Automatisation créée:', newAutomation.name);
      return newAutomation;
    } catch (error) {
      console.error('Erreur création automatisation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une automatisation existante
   */
  public async updateAutomation(automation: Automation): Promise<boolean> {
    try {
      const index = this.automations.findIndex(a => a.id === automation.id);
      if (index === -1) {
        throw new Error('Automatisation non trouvée');
      }

      this.automations[index] = automation;
      await this.saveAutomations();

      // Re-programmer la notification si nécessaire
      if (automation.trigger === 'time' && automation.schedule) {
        await this.cancelNotification(automation.id);
        await this.scheduleNotification(automation);
      }

      console.log('Automatisation mise à jour:', automation.name);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour automatisation:', error);
      return false;
    }
  }

  /**
   * Supprime une automatisation
   */
  public async deleteAutomation(automationId: string): Promise<boolean> {
    try {
      const index = this.automations.findIndex(a => a.id === automationId);
      if (index === -1) {
        throw new Error('Automatisation non trouvée');
      }

      // Annuler la notification si elle existe
      await this.cancelNotification(automationId);

      this.automations.splice(index, 1);
      await this.saveAutomations();

      console.log('Automatisation supprimée:', automationId);
      return true;
    } catch (error) {
      console.error('Erreur suppression automatisation:', error);
      return false;
    }
  }

  /**
   * Active/désactive une automatisation
   */
  public async toggleAutomation(automationId: string, isEnabled: boolean): Promise<boolean> {
    try {
      const automation = this.automations.find(a => a.id === automationId);
      if (!automation) {
        throw new Error('Automatisation non trouvée');
      }

      automation.isEnabled = isEnabled;
      await this.saveAutomations();

      if (isEnabled && automation.trigger === 'time' && automation.schedule) {
        await this.scheduleNotification(automation);
      } else {
        await this.cancelNotification(automationId);
      }

      console.log('Automatisation modifiée:', automationId, isEnabled);
      return true;
    } catch (error) {
      console.error('Erreur modification automatisation:', error);
      return false;
    }
  }

  /**
   * Exécute une automatisation
   */
  public async executeAutomation(automation: Automation): Promise<boolean> {
    try {
      if (!automation.isEnabled) {
        console.log('Automatisation désactivée:', automation.name);
        return false;
      }

      console.log('Exécution automatisation:', automation.name);
      
      // TODO: Implémenter l'exécution des actions
      // Pour l'instant, on simule l'exécution
      await this.simulateAction(automation.action);
      
      return true;
    } catch (error) {
      console.error('Erreur exécution automatisation:', error);
      return false;
    }
  }

  /**
   * Obtient toutes les automatisations
   */
  public getAutomations(): Automation[] {
    return [...this.automations];
  }

  /**
   * Obtient les automatisations actives
   */
  public getActiveAutomations(): Automation[] {
    return this.automations.filter(a => a.isEnabled);
  }

  /**
   * Programme une notification pour une automatisation temporelle
   */
  private async scheduleNotification(automation: Automation): Promise<void> {
    try {
      if (automation.trigger !== 'time' || !automation.schedule) {
        return;
      }

      // Parse le schedule (format: "HH:MM" ou "HH:MM:SS")
      const [hours, minutes] = automation.schedule.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // Si l'heure est passée aujourd'hui, programmer pour demain
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'RemoteUniversal',
          body: `Exécution de l'automatisation: ${automation.name}`,
          data: { automationId: automation.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledTime,
        },
      });

      console.log('Notification programmée pour:', scheduledTime);
    } catch (error) {
      console.error('Erreur programmation notification:', error);
    }
  }

  /**
   * Annule une notification
   */
  private async cancelNotification(automationId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notificationToCancel = scheduledNotifications.find(
        notification => notification.content.data?.automationId === automationId
      );

      if (notificationToCancel) {
        await Notifications.cancelScheduledNotificationAsync(notificationToCancel.identifier);
        console.log('Notification annulée:', automationId);
      }
    } catch (error) {
      console.error('Erreur annulation notification:', error);
    }
  }

  /**
   * Simule l'exécution d'une action
   */
  private async simulateAction(action: string): Promise<void> {
    console.log('Simulation action:', action);
    
    // Simulation d'un délai d'exécution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implémenter les vraies actions
    // - power_on, power_off
    // - volume_up, volume_down, mute
    // - channel_up, channel_down
    // - custom_command
  }

  /**
   * Charge les automatisations depuis le stockage
   */
  private async loadAutomations(): Promise<void> {
    try {
      // TODO: Implémenter le chargement depuis StorageService
      // Pour l'instant, on utilise des automatisations par défaut
      this.automations = [
        {
          id: 'auto-power-on-morning',
          name: 'Allumage matinal',
          trigger: 'time',
          action: 'power_on',
          isEnabled: false,
          schedule: '07:00'
        },
        {
          id: 'auto-power-off-night',
          name: 'Extinction nocturne',
          trigger: 'time',
          action: 'power_off',
          isEnabled: false,
          schedule: '23:00'
        }
      ];

      console.log('Automatisations chargées:', this.automations.length);
    } catch (error) {
      console.error('Erreur chargement automatisations:', error);
    }
  }

  /**
   * Sauvegarde les automatisations
   */
  private async saveAutomations(): Promise<void> {
    try {
      // TODO: Implémenter la sauvegarde avec StorageService
      console.log('Automatisations sauvegardées:', this.automations.length);
    } catch (error) {
      console.error('Erreur sauvegarde automatisations:', error);
    }
  }

  /**
   * Nettoie les ressources
   */
  public async cleanup(): Promise<void> {
    try {
      // Annuler toutes les notifications programmées
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Service d\'automatisation nettoyé');
    } catch (error) {
      console.error('Erreur nettoyage automatisation:', error);
    }
  }
}
