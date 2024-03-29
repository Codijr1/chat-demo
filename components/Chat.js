import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import ColorSelection from './ColorSelection';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
    const { name } = route.params;
    const [selectedColor, setSelectedColor] = useState(route.params.selectedColor);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });

        const messagesRef = collection(db, 'messages');
        const unsubscribe = onSnapshot(query(messagesRef, orderBy('createdAt', 'desc')), (snapshot) => {
            const updatedMessages = snapshot.docs.map((doc) => {
                const firebaseData = doc.data();
                const message = {
                    _id: doc.id,
                    text: firebaseData.text,
                    createdAt: new Date(firebaseData.createdAt.toMillis()),
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
    }, []);

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

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
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
