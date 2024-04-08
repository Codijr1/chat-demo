import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// screens 
import Chat from './components/Chat.js';
import Start from './components/Start.js';

const firebaseConfig = {
  apiKey: "AIzaSyDvHskJtJSVrvkGZUG-uQYTHbnGz7HA62c",
  authDomain: "chat-demo.firebaseapp.com",
  projectId: "chat-demo-30ed1",
  storageBucket: "chat-demo.appspot.com",
  messagingSenderId: "22792638389",
  appId: "1:22792638389:web:e8f0fe4e29fa6e863fc7d2"
};


// initialize Firebase 
const app = initializeApp(firebaseConfig);

// initialize Firestore and storage
const db = getFirestore(app);
const storage = getStorage(app);

// initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus && connectionStatus.isConnected !== null && connectionStatus.isConnected !== undefined) {
      if (connectionStatus.isConnected === false) {
        Alert.alert("Connection Terminated");
        disableNetwork(db);
      } else if (connectionStatus.isConnected === true) {
        enableNetwork(db);
      }
    }
  }, [connectionStatus]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {props => <Chat isConnected={connectionStatus?.isConnected} db={db} storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;