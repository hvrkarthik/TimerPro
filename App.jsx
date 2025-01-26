import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimerForm from './src/components/TimerForm';
import TimerList from './src/components/TimerList';
import Export from './src/components/History';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TimersScreen() {
  return (
    <View style={styles.container}>
      <TimerForm />
      <TimerList />
    </View>
  );
}

function ExportScreen() {
  return (
    <View style={styles.container}>
      <Export />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleAlign: 'center',
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Timers"
          component={TimersScreen}
          options={{
            tabBarLabel: 'Timers',
          }}
        />
        <Tab.Screen
          name="Export"
          component={ExportScreen}
          options={{
            tabBarLabel: 'Export',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});