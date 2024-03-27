import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import ColorSelection from './ColorSelection';
import { GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const [selectedColor, setSelectedColor] = useState(route.params.selectedColor);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    const onSend = (newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    };

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Welcome to the Chat Log!</Text>
            </View>
            <View style={styles.chatContent}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1
                    }}
                />
            </View>
            <ColorSelection
                selectedColor={selectedColor}
                onSelectColor={handleColorSelection}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}

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
