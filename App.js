import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
