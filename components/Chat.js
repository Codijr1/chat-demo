import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import ColorSelection from './ColorSelection';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name } = route.params;
    const [selectedColor, setSelectedColor] = useState(route.params.selectedColor);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected) {
            const messagesRef = collection(db, 'messages');

            const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'desc')), (snapshot) => {
                const updatedMessages = snapshot.docs.map((doc) => {
                    const firebaseData = doc.data();
                    const message = {
                        _id: doc.id,
                        text: firebaseData.text,
                        createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : null,
                        user: {
                            _id: firebaseData.user._id,
                            name: firebaseData.user.name,
                            avatar: firebaseData.user.avatar,
                        },
                    };
                    return message;
                });
                setMessages(updatedMessages);
                cacheMessages(updatedMessages);
            });
            return () => {
                unsubscribe();
            };
        } else {
            loadCachedMessages();
        }
    }, [isConnected]);

    const cacheMessages = async (messages) => {
        try {
            await AsyncStorage.setItem('cachedMessages', JSON.stringify(messages));
        } catch (error) {
            console.error('Error caching messages:', error);
        }
    };

    const loadCachedMessages = async () => {
        try {
            const cachedMessages = await AsyncStorage.getItem('cachedMessages');
            if (cachedMessages !== null) {
                setMessages(JSON.parse(cachedMessages));
            }
        } catch (error) {
            console.error('Error loading cached messages:', error);
        }
    };

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#0191F7"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    const onSend = async (newMessages) => {
        if (!isConnected) { return; }

        const message = newMessages[0];
        const { _id, text, user } = message;
        const createdAt = serverTimestamp();
        const newMessage = {
            _id,
            text,
            user,
            createdAt,
        };
        await addDoc(collection(db, "messages"), newMessage);
    };

    const renderInputToolbar = (props) => {
        if (isConnected) {
            return <InputToolbar {...props} />;
        } else {
            return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome to the Chat Log!</Text>
            </View>
            <View style={styles.chatContent}>
                <GiftedChat
                    messages={messages}
                    renderBubble={renderBubble}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: route.params.userId,
                        name: route.params.name,
                    }}
                    renderInputToolbar={renderInputToolbar}
                    renderActions={() => <CustomActions onSend={onSend} storage={db} userID={route.params.userId} />}
                />
            </View>
            <ColorSelection
                selectedColor={selectedColor}
                onSelectColor={handleColorSelection}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height:5' /> : null}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding:5' /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingTop: 50,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
        width: '100%',
        paddingBottom: 20,
    },
});

export default Chat;
