// Version web de AutomationService (fallback)
export class AutomationService {
  private static instance: AutomationService;
  private automations: any[] = [];
  private storageService: any;

  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  constructor() {
    this.storageService = null;
  }

  public async initialize(): Promise<boolean> {
    console.log('AutomationService (web): Service d\'automatisation non disponible sur le web');
    await this.loadAutomations();
    return false;
  }

  public async createAutomation(automation: any): Promise<any> {
    const newAutomation = {
      ...automation,
      id: Date.now().toString(),
    };

    this.automations.push(newAutomation);
    await this.saveAutomations();

    console.log('AutomationService (web): Automatisation créée (simulation):', newAutomation.name);
    return newAutomation;
  }

  public async updateAutomation(automation: any): Promise<boolean> {
    const index = this.automations.findIndex(a => a.id === automation.id);
    if (index === -1) {
      throw new Error('Automatisation non trouvée');
    }

    this.automations[index] = automation;
    await this.saveAutomations();

    console.log('AutomationService (web): Automatisation mise à jour (simulation):', automation.name);
    return true;
  }

  public async deleteAutomation(automationId: string): Promise<boolean> {
    const index = this.automations.findIndex(a => a.id === automationId);
    if (index === -1) {
      throw new Error('Automatisation non trouvée');
    }

    this.automations.splice(index, 1);
    await this.saveAutomations();

    console.log('AutomationService (web): Automatisation supprimée (simulation):', automationId);
    return true;
  }

  public async toggleAutomation(automationId: string, isEnabled: boolean): Promise<boolean> {
    const automation = this.automations.find(a => a.id === automationId);
    if (!automation) {
      throw new Error('Automatisation non trouvée');
    }

    automation.isEnabled = isEnabled;
    await this.saveAutomations();

    console.log('AutomationService (web): Automatisation modifiée (simulation):', automationId, isEnabled);
    return true;
  }

  public async executeAutomation(automation: any): Promise<boolean> {
    if (!automation.isEnabled) {
      console.log('AutomationService (web): Automatisation désactivée:', automation.name);
      return false;
    }

    console.log('AutomationService (web): Exécution automatisation (simulation):', automation.name);
    return true;
  }

  public getAutomations(): any[] {
    return [...this.automations];
  }

  public getActiveAutomations(): any[] {
    return this.automations.filter(a => a.isEnabled);
  }

  private async loadAutomations(): Promise<void> {
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

    console.log('AutomationService (web): Automatisations chargées (simulation):', this.automations.length);
  }

  private async saveAutomations(): Promise<void> {
    console.log('AutomationService (web): Automatisations sauvegardées (simulation):', this.automations.length);
  }

  public async cleanup(): Promise<void> {
    console.log('AutomationService (web): Service d\'automatisation nettoyé (simulation)');
  }
}
