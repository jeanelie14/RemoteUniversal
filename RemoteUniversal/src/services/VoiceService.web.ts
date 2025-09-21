// Version web de VoiceService (fallback)
export class VoiceService {
  private static instance: VoiceService;
  private isListening: boolean = false;
  private commands: any[] = [];
  private onCommandRecognized?: (command: string) => void;

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  public async initialize(): Promise<boolean> {
    console.log('VoiceService (web): Service vocal non disponible sur le web');
    return false;
  }

  public async startListening(): Promise<void> {
    console.log('VoiceService (web): Écoute vocale non disponible sur le web');
  }

  public async stopListening(): Promise<void> {
    console.log('VoiceService (web): Arrêt écoute non disponible sur le web');
  }

  public async processCommand(command: string): Promise<boolean> {
    console.log('VoiceService (web): Traitement commande non disponible sur le web');
    return false;
  }

  public setCommandCallback(callback: (command: string) => void): void {
    this.onCommandRecognized = callback;
  }

  public addCustomCommand(voiceCommand: any): void {
    console.log('VoiceService (web): Ajout commande non disponible sur le web');
  }

  public removeCommand(commandId: string): void {
    console.log('VoiceService (web): Suppression commande non disponible sur le web');
  }

  public toggleCommand(commandId: string, isActive: boolean): void {
    console.log('VoiceService (web): Modification commande non disponible sur le web');
  }

  public isCurrentlyListening(): boolean {
    return false;
  }

  public getAvailableCommands(): any[] {
    return [];
  }

  public async cleanup(): Promise<void> {
    console.log('VoiceService (web): Nettoyage non disponible sur le web');
  }
}
