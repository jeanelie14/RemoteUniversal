import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ButtonPower } from '../components/ButtonPower';
import { Trackpad } from '../components/Trackpad';
import { VoiceControl } from '../components/VoiceControl';
import { WiFiService } from '../services/WiFiService';
import { IRService } from '../services/IRService';
import { VoiceService } from '../services/VoiceService';
import { RootStackParamList } from '../navigation/AppNavigator';

type ControlScreenRouteProp = RouteProp<RootStackParamList, 'Control'>;

export const ControlScreen: React.FC = () => {
  const route = useRoute<ControlScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedTV } = route.params;
  const [isTVOn, setIsTVOn] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  useEffect(() => {
    // Initialiser les services
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialiser le service IR
      const irService = IRService.getInstance();
      await irService.initialize();

      // Initialiser le service vocal
      const voiceService = VoiceService.getInstance();
      await voiceService.initialize();
    } catch (error) {
      console.error('Erreur initialisation services:', error);
    }
  };

  const handlePowerToggle = async () => {
    try {
      if (selectedTV.connectionType === 'wifi') {
        const wifiService = WiFiService.getInstance();
        await wifiService.sendCommand('power', { state: !isTVOn });
      } else {
        const irService = IRService.getInstance();
        await irService.sendCommand('power');
      }
      setIsTVOn(!isTVOn);
    } catch (error) {
      console.error('Erreur commande power:', error);
    }
  };

  const handleVolumeUp = async () => {
    if (volume < 100) {
      try {
        if (selectedTV.connectionType === 'wifi') {
          const wifiService = WiFiService.getInstance();
          await wifiService.sendCommand('volume_up');
        } else {
          const irService = IRService.getInstance();
          await irService.sendCommand('volume_up');
        }
        setVolume(volume + 5);
      } catch (error) {
        console.error('Erreur commande volume up:', error);
      }
    }
  };

  const handleVolumeDown = async () => {
    if (volume > 0) {
      try {
        if (selectedTV.connectionType === 'wifi') {
          const wifiService = WiFiService.getInstance();
          await wifiService.sendCommand('volume_down');
        } else {
          const irService = IRService.getInstance();
          await irService.sendCommand('volume_down');
        }
        setVolume(volume - 5);
      } catch (error) {
        console.error('Erreur commande volume down:', error);
      }
    }
  };

  const handleMuteToggle = async () => {
    try {
      if (selectedTV.connectionType === 'wifi') {
        const wifiService = WiFiService.getInstance();
        await wifiService.sendCommand('mute', { state: !isMuted });
      } else {
        const irService = IRService.getInstance();
        await irService.sendCommand('mute');
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Erreur commande mute:', error);
    }
  };

  const handleChannelUp = async () => {
    try {
      if (selectedTV.connectionType === 'wifi') {
        const wifiService = WiFiService.getInstance();
        await wifiService.sendCommand('channel_up');
      } else {
        const irService = IRService.getInstance();
        await irService.sendCommand('channel_up');
      }
    } catch (error) {
      console.error('Erreur commande channel up:', error);
    }
  };

  const handleChannelDown = async () => {
    try {
      if (selectedTV.connectionType === 'wifi') {
        const wifiService = WiFiService.getInstance();
        await wifiService.sendCommand('channel_down');
      } else {
        const irService = IRService.getInstance();
        await irService.sendCommand('channel_down');
      }
    } catch (error) {
      console.error('Erreur commande channel down:', error);
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Commande vocale reconnue:', command);
    
    switch (command) {
      case 'power_on':
        if (!isTVOn) handlePowerToggle();
        break;
      case 'power_off':
        if (isTVOn) handlePowerToggle();
        break;
      case 'volume_up':
        handleVolumeUp();
        break;
      case 'volume_down':
        handleVolumeDown();
        break;
      case 'mute':
        if (!isMuted) handleMuteToggle();
        break;
      case 'unmute':
        if (isMuted) handleMuteToggle();
        break;
      case 'channel_up':
        handleChannelUp();
        break;
      case 'channel_down':
        handleChannelDown();
        break;
      case 'ok':
        // TODO: Implémenter action OK
        break;
      default:
        console.log('Commande non reconnue:', command);
    }
  };

  const handleTrackpadSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    console.log('Swipe détecté:', direction);
    
    switch (direction) {
      case 'up':
        // TODO: Implémenter action swipe up
        break;
      case 'down':
        // TODO: Implémenter action swipe down
        break;
      case 'left':
        handleChannelDown();
        break;
      case 'right':
        handleChannelUp();
        break;
    }
  };

  const handleTrackpadTap = () => {
    console.log('Tap détecté sur trackpad');
    // TODO: Implémenter action tap
  };

  const handleTrackpadLongPress = () => {
    console.log('Long press détecté sur trackpad');
    // TODO: Implémenter action long press
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.tvName}>{selectedTV.name}</Text>
        <Text style={styles.tvStatus}>
          {isTVOn ? 'Allumée' : 'Éteinte'}
        </Text>
        
        <TouchableOpacity
          style={styles.advancedButton}
          onPress={() => setShowAdvancedControls(!showAdvancedControls)}
        >
          <Text style={styles.advancedButtonText}>
            {showAdvancedControls ? 'Masquer' : 'Avancé'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>
        {/* Bouton Power */}
        <View style={styles.powerSection}>
          <ButtonPower
            onPress={handlePowerToggle}
            isOn={isTVOn}
          />
        </View>

        {/* Contrôles Volume */}
        <View style={styles.volumeSection}>
          <Text style={styles.sectionTitle}>Volume</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity 
              style={styles.volumeButton}
              onPress={handleVolumeDown}
            >
              <Text style={styles.volumeButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.volumeDisplay}>
              <Text style={styles.volumeText}>
                {isMuted ? 'MUTE' : `${volume}%`}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.volumeButton}
              onPress={handleVolumeUp}
            >
              <Text style={styles.volumeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.muteButton}
            onPress={handleMuteToggle}
          >
            <Text style={styles.muteButtonText}>
              {isMuted ? 'Démuter' : 'Muter'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contrôles Chaînes */}
        <View style={styles.channelSection}>
          <Text style={styles.sectionTitle}>Chaînes</Text>
          <View style={styles.channelControls}>
            <TouchableOpacity 
              style={styles.channelButton}
              onPress={handleChannelDown}
            >
              <Text style={styles.channelButtonText}>-</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.channelButton}
              onPress={handleChannelUp}
            >
              <Text style={styles.channelButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contrôles Directionnels */}
        <View style={styles.directionalSection}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <View style={styles.directionalControls}>
            <View style={styles.directionalRow}>
              <TouchableOpacity style={styles.directionalButton}>
                <Text style={styles.directionalButtonText}>↑</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.directionalRow}>
              <TouchableOpacity style={styles.directionalButton}>
                <Text style={styles.directionalButtonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.directionalButton}>
                <Text style={styles.directionalButtonText}>→</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.directionalRow}>
              <TouchableOpacity style={styles.directionalButton}>
                <Text style={styles.directionalButtonText}>↓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contrôles avancés */}
        {showAdvancedControls && (
          <View style={styles.advancedSection}>
            <Text style={styles.sectionTitle}>Contrôles Avancés</Text>
            
            {/* Trackpad virtuel */}
            <View style={styles.trackpadSection}>
              <Text style={styles.subsectionTitle}>Trackpad</Text>
              <Trackpad
                onSwipeUp={() => handleTrackpadSwipe('up')}
                onSwipeDown={() => handleTrackpadSwipe('down')}
                onSwipeLeft={() => handleTrackpadSwipe('left')}
                onSwipeRight={() => handleTrackpadSwipe('right')}
                onTap={handleTrackpadTap}
                onLongPress={handleTrackpadLongPress}
              />
            </View>

            {/* Contrôle vocal */}
            <View style={styles.voiceSection}>
              <VoiceControl
                onCommandRecognized={handleVoiceCommand}
              />
            </View>

            {/* Bouton automatisations */}
            <TouchableOpacity
              style={styles.automationButton}
              onPress={() => (navigation as any).navigate('Automation')}
            >
              <Text style={styles.automationButtonText}>⚙️ Automatisations</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tvName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tvStatus: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  advancedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
  },
  advancedButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    flex: 1,
    padding: 20,
  },
  powerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  volumeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  volumeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  volumeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  volumeDisplay: {
    width: 80,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  volumeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  muteButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  muteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelSection: {
    marginBottom: 30,
  },
  channelControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  channelButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  channelButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  directionalSection: {
    marginBottom: 30,
  },
  directionalControls: {
    alignItems: 'center',
  },
  directionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  directionalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  directionalButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  okButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  advancedSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  trackpadSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceSection: {
    marginBottom: 20,
  },
  automationButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  automationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
