import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';
import backgroundImage from '../assets/Background Image.png';
import ColorSelection from './ColorSelection';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);

    const auth = getAuth();

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    // anonymous ign in
    const signInAnonymouslyHandler = () => {
        signInAnonymously(auth)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate('Chat', { userId: user.uid, name: name, selectedColor: selectedColor });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);
            });
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text>Welcome to the Chat App!</Text>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Type your name to get started'
                />
                <ColorSelection onSelectColor={handleColorSelection} />
                <Button
                    title="Start Chatting"
                    onPress={signInAnonymouslyHandler}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});

export default Start;
