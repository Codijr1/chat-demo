import React, { useState } from 'react';
import { StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                console.log('Location fetched successfully:', location.coords);
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions.status !== 'granted') {
            Alert.alert('Library Permissions Required');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
        console.log("Image Picker Result:", result);
        if (!result.cancelled && result.uri) {
            console.log("Selected Image URI:", result.uri);
            uploadAndSendImage(result.uri);
        }
    };

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions.status !== 'granted') {
            Alert.alert('Camera Permissions Required');
            return;
        }
        let result = await ImagePicker.launchCameraAsync();
        console.log("Camera Result:", result);
        if (!result.cancelled && result.uri) {
            console.log("Taken Photo URI:", result.uri);
            uploadAndSendImage(result.uri);
        }
    };

    const uploadAndSendImage = async (imageURI) => {
        console.log('Uploading image:', imageURI);
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        try {
            setUploading(true);
            const response = await fetch(imageURI);
            const blob = await response.blob();
            await uploadBytes(newUploadRef, blob);
            console.log('Picture sent');
            const imageURL = await getDownloadURL(newUploadRef);
            onSend({ image: imageURL });
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

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
