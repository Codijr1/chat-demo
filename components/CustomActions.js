import { StyleSheet, View, Text, Alert, Button } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useState } from 'react';

const CustomActions = ({ onSend, storage, userID }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [uploading, setUploading] = useState(false);

    const onActionPress = () => {
        if (uploading) {
            Alert.alert('Please wait', 'Upload in progress');
            return;
        }
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        break;
                    case 1:
                        takePhoto();
                        break;
                    case 2:
                        getLocation();
                        break;
                    default:
                }
            },
        );
    }

    const getLocation = async () => {

    }

    const uploadAndSendImage = async (imageURI) => {

    };

    const pickImage = async () => {

    }

    const takePhoto = async () => {

    }

    const generateReference = (uri) => {

    };

    return (
        <>
            <Button title="+" onPress={onActionPress} />
            {uploading && <ActivityIndicator />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;
