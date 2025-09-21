import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '../store';
import { startScanning, setDevices, setError, selectDevice } from '../store/slices/tvSlice';
import { WiFiService } from '../services/WiFiService';
import { TVDevice } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const { devices, isScanning, error } = useSelector((state: RootState) => state.tv);

  const scanForTVs = async () => {
    dispatch(startScanning());
    
    try {
      const wifiService = WiFiService.getInstance();
      const discoveredTVs = await wifiService.scanForTVs();
      dispatch(setDevices(discoveredTVs));
    } catch (err) {
      dispatch(setError('Erreur lors du scan des TVs'));
      console.error('Scan error:', err);
    }
  };

  const handleTVSelect = async (tv: TVDevice) => {
    try {
      const wifiService = WiFiService.getInstance();
      const connected = await wifiService.connectToTV(tv);
      
      if (connected) {
        dispatch(selectDevice(tv));
        navigation.navigate('Control', { selectedTV: tv });
      } else {
        dispatch(setError('Impossible de se connecter à cette TV'));
      }
    } catch (err) {
      dispatch(setError('Erreur de connexion'));
      console.error('Connection error:', err);
    }
  };

  const renderTVItem = ({ item }: { item: TVDevice }) => (
    <TouchableOpacity
      style={styles.tvItem}
      onPress={() => handleTVSelect(item)}
    >
      <Text style={styles.tvName}>{item.name}</Text>
      <Text style={styles.tvDetails}>{item.brand} {item.model}</Text>
      <Text style={styles.tvIP}>{item.ipAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RemoteUniversal</Text>
      <Text style={styles.subtitle}>Sélectionnez votre TV</Text>
      
      <TouchableOpacity
        style={styles.scanButton}
        onPress={scanForTVs}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.scanButtonText}>Scanner les TVs</Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        data={devices}
        renderItem={renderTVItem}
        keyExtractor={(item) => item.id}
        style={styles.tvList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  tvList: {
    flex: 1,
  },
  tvItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tvName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tvDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  tvIP: {
    fontSize: 12,
    color: '#999',
  },
});
