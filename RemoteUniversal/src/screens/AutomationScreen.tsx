import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AutomationService } from '../services/AutomationService';
import { Automation } from '../types';

export const AutomationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: 'time' as 'time' | 'voice' | 'gesture',
    action: '',
    schedule: '',
    isEnabled: false
  });

  const automationService = AutomationService.getInstance();

  useEffect(() => {
    initializeAutomations();
  }, []);

  const initializeAutomations = async () => {
    try {
      await automationService.initialize();
      setAutomations(automationService.getAutomations());
    } catch (error) {
      console.error('Erreur initialisation automatisations:', error);
    }
  };

  const handleToggleAutomation = async (automation: Automation) => {
    try {
      const success = await automationService.toggleAutomation(
        automation.id,
        !automation.isEnabled
      );
      
      if (success) {
        setAutomations(automationService.getAutomations());
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier l\'automatisation');
    }
  };

  const handleDeleteAutomation = (automation: Automation) => {
    Alert.alert(
      'Supprimer l\'automatisation',
      `Êtes-vous sûr de vouloir supprimer "${automation.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await automationService.deleteAutomation(automation.id);
              if (success) {
                setAutomations(automationService.getAutomations());
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'automatisation');
            }
          }
        }
      ]
    );
  };

  const handleCreateAutomation = async () => {
    if (!newAutomation.name || !newAutomation.action) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const automation = await automationService.createAutomation(newAutomation);
      setAutomations(automationService.getAutomations());
      setIsModalVisible(false);
      setNewAutomation({
        name: '',
        trigger: 'time',
        action: '',
        schedule: '',
        isEnabled: false
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer l\'automatisation');
    }
  };

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
    setNewAutomation({
      name: automation.name,
      trigger: automation.trigger,
      action: automation.action,
      schedule: automation.schedule || '',
      isEnabled: automation.isEnabled
    });
    setIsModalVisible(true);
  };

  const handleUpdateAutomation = async () => {
    if (!editingAutomation || !newAutomation.name || !newAutomation.action) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const updatedAutomation: Automation = {
        ...editingAutomation,
        ...newAutomation
      };
      
      const success = await automationService.updateAutomation(updatedAutomation);
      if (success) {
        setAutomations(automationService.getAutomations());
        setIsModalVisible(false);
        setEditingAutomation(null);
        setNewAutomation({
          name: '',
          trigger: 'time',
          action: '',
          schedule: '',
          isEnabled: false
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'automatisation');
    }
  };

  const renderAutomationItem = ({ item }: { item: Automation }) => (
    <View style={styles.automationItem}>
      <View style={styles.automationHeader}>
        <Text style={styles.automationName}>{item.name}</Text>
        <Switch
          value={item.isEnabled}
          onValueChange={() => handleToggleAutomation(item)}
          trackColor={{ false: '#CCCCCC', true: '#4CAF50' }}
          thumbColor={item.isEnabled ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>
      
      <Text style={styles.automationDetails}>
        Déclencheur: {item.trigger === 'time' ? 'Temps' : 
                    item.trigger === 'voice' ? 'Voix' : 'Geste'}
      </Text>
      
      <Text style={styles.automationDetails}>
        Action: {item.action}
      </Text>
      
      {item.schedule && (
        <Text style={styles.automationDetails}>
          Horaire: {item.schedule}
        </Text>
      )}
      
      <View style={styles.automationActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditAutomation(item)}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAutomation(item)}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Automatisations</Text>
      </View>

      <FlatList
        data={automations}
        renderItem={renderAutomationItem}
        keyExtractor={(item) => item.id}
        style={styles.automationList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune automatisation</Text>
            <Text style={styles.emptySubtext}>
              Créez votre première automatisation
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Nouvelle automatisation</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAutomation ? 'Modifier l\'automatisation' : 'Nouvelle automatisation'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsModalVisible(false);
                setEditingAutomation(null);
                setNewAutomation({
                  name: '',
                  trigger: 'time',
                  action: '',
                  schedule: '',
                  isEnabled: false
                });
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Nom *</Text>
            <TextInput
              style={styles.textInput}
              value={newAutomation.name}
              onChangeText={(text) => setNewAutomation({ ...newAutomation, name: text })}
              placeholder="Ex: Allumage matinal"
            />

            <Text style={styles.inputLabel}>Déclencheur *</Text>
            <View style={styles.triggerButtons}>
              {['time', 'voice', 'gesture'].map((trigger) => (
                <TouchableOpacity
                  key={trigger}
                  style={[
                    styles.triggerButton,
                    newAutomation.trigger === trigger && styles.triggerButtonSelected
                  ]}
                  onPress={() => setNewAutomation({ ...newAutomation, trigger: trigger as any })}
                >
                  <Text style={[
                    styles.triggerButtonText,
                    newAutomation.trigger === trigger && styles.triggerButtonTextSelected
                  ]}>
                    {trigger === 'time' ? 'Temps' : trigger === 'voice' ? 'Voix' : 'Geste'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {newAutomation.trigger === 'time' && (
              <>
                <Text style={styles.inputLabel}>Horaire (HH:MM) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newAutomation.schedule}
                  onChangeText={(text) => setNewAutomation({ ...newAutomation, schedule: text })}
                  placeholder="Ex: 07:00"
                  keyboardType="numeric"
                />
              </>
            )}

            <Text style={styles.inputLabel}>Action *</Text>
            <TextInput
              style={styles.textInput}
              value={newAutomation.action}
              onChangeText={(text) => setNewAutomation({ ...newAutomation, action: text })}
              placeholder="Ex: power_on, volume_up, channel_down"
            />

            <View style={styles.enableContainer}>
              <Text style={styles.inputLabel}>Activé</Text>
              <Switch
                value={newAutomation.isEnabled}
                onValueChange={(value) => setNewAutomation({ ...newAutomation, isEnabled: value })}
                trackColor={{ false: '#CCCCCC', true: '#4CAF50' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsModalVisible(false);
                setEditingAutomation(null);
                setNewAutomation({
                  name: '',
                  trigger: 'time',
                  action: '',
                  schedule: '',
                  isEnabled: false
                });
              }}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingAutomation ? handleUpdateAutomation : handleCreateAutomation}
            >
              <Text style={styles.saveButtonText}>
                {editingAutomation ? 'Modifier' : 'Créer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  automationList: {
    flex: 1,
    padding: 20,
  },
  automationItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  automationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  automationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  automationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  automationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  triggerButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  triggerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 10,
  },
  triggerButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  triggerButtonText: {
    fontSize: 14,
    color: '#666',
  },
  triggerButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  enableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
