import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { 
  PanGestureHandler, 
  State,
  PanGestureHandlerGestureEvent 
} from 'react-native-gesture-handler';

interface TrackpadProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const MIN_SWIPE_DISTANCE = 50;
const MIN_SWIPE_VELOCITY = 500;

export const Trackpad: React.FC<TrackpadProps> = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onLongPress,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (disabled) return;

    const { translationX, translationY, velocityX, velocityY, state } = event.nativeEvent;

    switch (state) {
      case State.BEGAN:
        setIsPressed(true);
        startLongPressTimer();
        break;

      case State.END:
        setIsPressed(false);
        clearLongPressTimer();
        
        // Détection des swipes
        const absTranslationX = Math.abs(translationX);
        const absTranslationY = Math.abs(translationY);
        const absVelocityX = Math.abs(velocityX);
        const absVelocityY = Math.abs(velocityY);

        // Vérifier si c'est un swipe horizontal
        if (absTranslationX > MIN_SWIPE_DISTANCE && absVelocityX > MIN_SWIPE_VELOCITY) {
          if (translationX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
        // Vérifier si c'est un swipe vertical
        else if (absTranslationY > MIN_SWIPE_DISTANCE && absVelocityY > MIN_SWIPE_VELOCITY) {
          if (translationY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
        // Vérifier si c'est un tap
        else if (absTranslationX < 20 && absTranslationY < 20) {
          handleTap();
        }
        break;

      case State.CANCELLED:
      case State.FAILED:
        setIsPressed(false);
        clearLongPressTimer();
        break;
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap détecté
      onTap?.();
    } else {
      // Simple tap
      onTap?.();
    }
    
    setLastTap(now);
  };

  const startLongPressTimer = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress?.();
    }, 800); // 800ms pour long press
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
      minPointers={1}
      maxPointers={1}
    >
      <View style={[
        styles.trackpad,
        isPressed && styles.trackpadPressed,
        disabled && styles.trackpadDisabled
      ]}>
        <View style={styles.trackpadCenter}>
          <Text style={styles.trackpadText}>
            {disabled ? 'Désactivé' : 'Trackpad'}
          </Text>
          <Text style={styles.trackpadSubtext}>
            Glissez pour naviguer
          </Text>
        </View>
        
        {/* Indicateurs de direction */}
        <View style={styles.directionIndicators}>
          <View style={[styles.indicator, styles.indicatorUp]} />
          <View style={[styles.indicator, styles.indicatorLeft]} />
          <View style={[styles.indicator, styles.indicatorRight]} />
          <View style={[styles.indicator, styles.indicatorDown]} />
        </View>
      </View>
    </PanGestureHandler>
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
  trackpadPressed: {
    backgroundColor: '#BDBDBD',
    transform: [{ scale: 0.95 }],
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
