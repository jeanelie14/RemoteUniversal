import { VoiceService } from '../VoiceService';
import { VoiceCommand } from '../../types';

describe('VoiceService', () => {
  let voiceService: VoiceService;

  beforeEach(() => {
    voiceService = VoiceService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = VoiceService.getInstance();
      const instance2 = VoiceService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const result = await voiceService.initialize();
      expect(result).toBe(true);
    });

    it('should load voice commands', async () => {
      await voiceService.initialize();
      const commands = voiceService.getAvailableCommands();
      expect(commands.length).toBeGreaterThan(0);
    });
  });

  describe('voice commands', () => {
    beforeEach(async () => {
      await voiceService.initialize();
    });

    it('should have predefined voice commands', () => {
      const commands = voiceService.getAvailableCommands();
      
      const expectedCommands = [
        'allume la télé',
        'éteint la télé',
        'augmente le volume',
        'diminue le volume',
        'coupe le son',
        'remet le son',
        'chaîne suivante',
        'chaîne précédente',
        'valide'
      ];

      expectedCommands.forEach(expectedCommand => {
        const found = commands.find(cmd => cmd.command === expectedCommand);
        expect(found).toBeDefined();
        expect(found?.isActive).toBe(true);
      });
    });

    it('should process voice commands correctly', async () => {
      const mockCallback = jest.fn();
      voiceService.setCommandCallback(mockCallback);

      const result = await voiceService.processCommand('allume la télé');
      expect(result).toBe(true);
      expect(mockCallback).toHaveBeenCalledWith('power_on');
    });

    it('should return false for unknown commands', async () => {
      const result = await voiceService.processCommand('commande inconnue');
      expect(result).toBe(false);
    });
  });

  describe('listening state', () => {
    it('should start listening', async () => {
      await voiceService.startListening();
      expect(voiceService.isCurrentlyListening()).toBe(true);
    });

    it('should stop listening', async () => {
      await voiceService.startListening();
      await voiceService.stopListening();
      expect(voiceService.isCurrentlyListening()).toBe(false);
    });
  });

  describe('custom commands', () => {
    beforeEach(async () => {
      await voiceService.initialize();
    });

    it('should add custom command', () => {
      const customCommand: VoiceCommand = {
        id: 'custom-1',
        command: 'test command',
        action: 'test_action',
        isActive: true
      };

      voiceService.addCustomCommand(customCommand);
      const commands = voiceService.getAvailableCommands();
      const found = commands.find(cmd => cmd.id === 'custom-1');
      expect(found).toBeDefined();
    });

    it('should toggle command active state', () => {
      const commands = voiceService.getAvailableCommands();
      const firstCommand = commands[0];
      
      voiceService.toggleCommand(firstCommand.id, false);
      const updatedCommands = voiceService.getAvailableCommands();
      const updatedCommand = updatedCommands.find(cmd => cmd.id === firstCommand.id);
      expect(updatedCommand?.isActive).toBe(false);
    });

    it('should remove command', () => {
      const commands = voiceService.getAvailableCommands();
      const firstCommand = commands[0];
      
      voiceService.removeCommand(firstCommand.id);
      const updatedCommands = voiceService.getAvailableCommands();
      const removedCommand = updatedCommands.find(cmd => cmd.id === firstCommand.id);
      expect(removedCommand).toBeUndefined();
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources', async () => {
      await voiceService.initialize();
      await voiceService.cleanup();
      expect(voiceService.isCurrentlyListening()).toBe(false);
    });
  });
});
