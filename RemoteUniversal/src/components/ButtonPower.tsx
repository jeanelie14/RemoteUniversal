import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonPowerProps {
  onPress: () => void;
  isOn: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const ButtonPower: React.FC<ButtonPowerProps> = ({ 
  onPress, 
  isOn, 
  disabled = false,
  loading = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOn ? styles.buttonOn : styles.buttonOff,
        disabled && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={[
        styles.buttonText,
        isOn ? styles.buttonTextOn : styles.buttonTextOff
      ]}>
        {loading ? '...' : (isOn ? 'ON' : 'OFF')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonOn: {
    backgroundColor: '#4CAF50',
  },
  buttonOff: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOn: {
    color: '#FFFFFF',
  },
  buttonTextOff: {
    color: '#FFFFFF',
  },
});
