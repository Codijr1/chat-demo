import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ColorSelection = ({ selectedColor, onSelectColor }) => {

    //define colors
    const backgroundColors = ['#9FD0CB', '#B1D2D9', '#E7D6CE', '#ECDEB1', '#DBBA97'];

    return (
        <View style={styles.container}>
            {backgroundColors.map((color, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => onSelectColor(color)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        top: 0,
        left: 0,
        marginTop: 5,
        marginLeft: 5,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#2E2E2E',
        marginHorizontal: 5,
    },
});

export default ColorSelection;
