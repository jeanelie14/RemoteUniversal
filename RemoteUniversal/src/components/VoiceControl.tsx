import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated 
} from 'react-native';
import { VoiceService } from '../services/VoiceService';
import { VoiceCommand } from '../types';

interface VoiceControlProps {
  onCommandRecognized: (command: string) => void;
  disabled?: boolean;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  onCommandRecognized,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([]);
  const [lastRecognizedText, setLastRecognizedText] = useState<string>('');
  
  const pulseAnim = new Animated.Value(1);
  const voiceService = VoiceService.getInstance();

  useEffect(() => {
    initializeVoiceService();
    return () => {
      voiceService.cleanup();
    };
  }, []);

  const initializeVoiceService = async () => {
    try {
      const initialized = await voiceService.initialize();
      if (initialized) {
        setIsInitialized(true);
        setAvailableCommands(voiceService.getAvailableCommands());
        voiceService.setCommandCallback(handleCommandRecognized);
      }
    } catch (error) {
      console.error('Erreur initialisation service vocal:', error);
    }
  };

  const handleCommandRecognized = (command: string) => {
    setLastRecognizedText(command);
    onCommandRecognized(command);
    
    // Effacer le texte après 3 secondes
    setTimeout(() => {
      setLastRecognizedText('');
    }, 3000);
  };

  const startListening = async () => {
    if (disabled || !isInitialized) return;

    try {
      await voiceService.startListening();
      setIsListening(true);
      startPulseAnimation();
    } catch (error) {
      console.error('Erreur démarrage écoute:', error);
    }
  };

  const stopListening = async () => {
    if (!isListening) return;

    try {
      await voiceService.stopListening();
      setIsListening(false);
      stopPulseAnimation();
    } catch (error) {
      console.error('Erreur arrêt écoute:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    if (disabled || !isInitialized) {
      return [styles.voiceButton, styles.voiceButtonDisabled];
    }
    if (isListening) {
      return [styles.voiceButton, styles.voiceButtonListening];
    }
    return [styles.voiceButton, styles.voiceButtonReady];
  };

  const getButtonText = () => {
    if (disabled) return 'Désactivé';
    if (!isInitialized) return 'Initialisation...';
    if (isListening) return 'Écoute...';
    return 'Parler';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrôle Vocal</Text>
      
      <View style={styles.voiceButtonContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={getButtonStyle()}
            onPress={toggleListening}
            disabled={disabled || !isInitialized}
          >
            {isListening ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Text style={styles.voiceButtonText}>🎤</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Text style={styles.buttonLabel}>{getButtonText()}</Text>
      </View>

      {lastRecognizedText && (
        <View style={styles.recognizedTextContainer}>
          <Text style={styles.recognizedText}>
            Commande reconnue: "{lastRecognizedText}"
          </Text>
        </View>
      )}

      <View style={styles.commandsContainer}>
        <Text style={styles.commandsTitle}>Commandes disponibles:</Text>
        {availableCommands.map((command) => (
          <View key={command.id} style={styles.commandItem}>
            <Text style={styles.commandText}>
              • "{command.command}" → {command.action}
            </Text>
          </View>
        ))}
      </View>

      {!isInitialized && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Service vocal non disponible
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  voiceButtonReady: {
    backgroundColor: '#4CAF50',
  },
  voiceButtonListening: {
    backgroundColor: '#FF5722',
  },
  voiceButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  voiceButtonText: {
    fontSize: 24,
  },
  buttonLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  recognizedTextContainer: {
    backgroundColor: '#E8F5E8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  recognizedText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  commandsContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commandsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  commandItem: {
    marginBottom: 5,
  },
  commandText: {
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    textAlign: 'center',
  },
});
