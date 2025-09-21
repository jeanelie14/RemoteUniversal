import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ControlScreen } from '../screens/ControlScreen';
import { AutomationScreen } from '../screens/AutomationScreen';
import { TVDevice } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Control: { selectedTV: TVDevice };
  Automation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'RemoteUniversal' }}
        />
        <Stack.Screen 
          name="Control" 
          component={ControlScreen}
          options={({ route }) => ({ 
            title: route.params.selectedTV.name 
          })}
        />
        <Stack.Screen 
          name="Automation" 
          component={AutomationScreen}
          options={{ 
            title: 'Automatisations' 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
