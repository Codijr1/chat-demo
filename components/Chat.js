import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ColorSelection from './ColorSelection';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const [selectedColor, setSelectedColor] = useState(route.params.selectedColor);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    return (
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
            <Text>Welcome to the chat log!</Text>
            <ColorSelection
                selectedColor={selectedColor}
                onSelectColor={handleColorSelection}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Chat;
