import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const Stack = createNativeStackNavigator();

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, 'messages');

    const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'desc')), (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => {
        const firebaseData = doc.data();
        const message = {
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt.toDate(), // Convert Firestore Timestamp to Date
          user: {
            _id: firebaseData.user._id,
            name: firebaseData.user.name,
            avatar: firebaseData.user.avatar,
          },
        };
        return message;
      });
      setMessages(updatedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        {/* Pass the db prop to the Chat component */}
        <Stack.Screen name="Chat">
          {(props) => <Chat {...props} db={db} />}
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
