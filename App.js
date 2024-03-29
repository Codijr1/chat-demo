import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/app';
import Chat from './components/Chat.js';
import Start from './components/Start.js';

const firebaseConfig = {
  apiKey: process.env.REACT_NATIVE_FIREBASE_API_KEY,
  authDomain: process.env.REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_NATIVE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_NATIVE_FIREBASE_APP_ID
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
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
