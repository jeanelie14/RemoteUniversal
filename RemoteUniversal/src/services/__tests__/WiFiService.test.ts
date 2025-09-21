import { WiFiService } from '../WiFiService';
import { TVDevice } from '../../types';

describe('WiFiService', () => {
  let wifiService: WiFiService;

  beforeEach(() => {
    wifiService = WiFiService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = WiFiService.getInstance();
      const instance2 = WiFiService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      const result = await wifiService.initialize();
      expect(result).toBe(true);
    });
  });

  describe('scanForTVs', () => {
    it('should return an array of TV devices', async () => {
      const tvs = await wifiService.scanForTVs();
      
      expect(Array.isArray(tvs)).toBe(true);
      expect(tvs.length).toBeGreaterThan(0);
      
      tvs.forEach(tv => {
        expect(tv).toHaveProperty('id');
        expect(tv).toHaveProperty('name');
        expect(tv).toHaveProperty('brand');
        expect(tv).toHaveProperty('model');
        expect(tv).toHaveProperty('ipAddress');
        expect(tv).toHaveProperty('connectionType');
        expect(tv).toHaveProperty('isConnected');
        expect(tv).toHaveProperty('lastUsed');
      });
    });

    it('should return TVs with correct connection type', async () => {
      const tvs = await wifiService.scanForTVs();
      
      tvs.forEach(tv => {
        expect(tv.connectionType).toBe('wifi');
      });
    });
  });

  describe('connectToTV', () => {
    it('should connect to a valid TV device', async () => {
      const mockTV: TVDevice = {
        id: 'test-tv',
        name: 'Test TV',
        brand: 'Samsung',
        model: 'Test Model',
        ipAddress: '192.168.1.100',
        connectionType: 'wifi',
        isConnected: false,
        lastUsed: new Date().toISOString(),
      };

      const result = await wifiService.connectToTV(mockTV);
      expect(result).toBe(true);
    });

    it('should handle connection errors gracefully', async () => {
      const invalidTV: TVDevice = {
        id: 'invalid-tv',
        name: 'Invalid TV',
        brand: 'Unknown',
        model: 'Unknown',
        ipAddress: 'invalid-ip',
        connectionType: 'wifi',
        isConnected: false,
        lastUsed: new Date().toISOString(),
      };

      const result = await wifiService.connectToTV(invalidTV);
      expect(result).toBe(false);
    });
  });

  describe('sendCommand', () => {
    it('should send WiFi commands successfully', async () => {
      const result = await wifiService.sendCommand('power', { state: true });
      expect(result).toBe(true);
    });

    it('should handle command errors', async () => {
      const result = await wifiService.sendCommand('invalid_command');
      expect(result).toBe(false);
    });
  });

  describe('disconnectFromTV', () => {
    it('should disconnect successfully', async () => {
      const result = await wifiService.disconnectFromTV();
      expect(result).toBe(true);
    });
  });
});
