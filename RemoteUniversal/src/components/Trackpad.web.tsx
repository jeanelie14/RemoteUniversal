// Version web de Trackpad (fallback)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TrackpadProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

export const Trackpad: React.FC<TrackpadProps> = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onLongPress,
  disabled = false
}) => {
  const handlePress = () => {
    if (disabled) return;
    onTap?.();
  };

  return (
    <TouchableOpacity
      style={[
        styles.trackpad,
        disabled && styles.trackpadDisabled
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={styles.trackpadCenter}>
        <Text style={styles.trackpadText}>
          {disabled ? 'Désactivé' : 'Trackpad (Web)'}
        </Text>
        <Text style={styles.trackpadSubtext}>
          Cliquez pour simuler
        </Text>
      </View>
      
      {/* Indicateurs de direction */}
      <View style={styles.directionIndicators}>
        <View style={[styles.indicator, styles.indicatorUp]} />
        <View style={[styles.indicator, styles.indicatorLeft]} />
        <View style={[styles.indicator, styles.indicatorRight]} />
        <View style={[styles.indicator, styles.indicatorDown]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trackpad: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  trackpadDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  trackpadCenter: {
    alignItems: 'center',
    zIndex: 2,
  },
  trackpadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  trackpadSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  directionIndicators: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  indicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#2196F3',
    borderRadius: 4,
    opacity: 0.3,
  },
  indicatorUp: {
    top: 20,
    left: '50%',
    marginLeft: -4,
  },
  indicatorDown: {
    bottom: 20,
    left: '50%',
    marginLeft: -4,
  },
  indicatorLeft: {
    left: 20,
    top: '50%',
    marginTop: -4,
  },
  indicatorRight: {
    right: 20,
    top: '50%',
    marginTop: -4,
  },
});
