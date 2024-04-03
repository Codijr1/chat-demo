import React from 'react';
import { Button, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ onSend, storage, userID, db }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Share Location', 'Cancel'];
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
                        shareLocation();
                        break;
                    default:
                }
            }
        );
    };
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions.status !== 'granted') {
            Alert.alert('Permission denied', 'You need to grant permission to access the image library.');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log("Image Picker Result:", result);
        if (!result.cancelled && result.uri) {
            console.log("Selected Image URI:", result.uri);
            uploadAndSendImage(result.uri);
        } else {
            Alert.alert('Image selection canceled');
        }
    };

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions.status !== 'granted') {
            Alert.alert('Permission denied', 'You need to grant permission to access the camera.');
            return;
        }
        let result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled && result.uri) {
            uploadAndSendImage(result.uri);
        } else {
            Alert.alert('Photo capture canceled');
        }
    };

    const uploadAndSendImage = async (imageURI) => {
        try {
            const uniqueRefString = generateReference(imageURI);
            const newUploadRef = ref(storage, uniqueRefString);
            const response = await fetch(imageURI);
            const blob = await response.blob();

            // Upload image to Firebase Storage
            const snapshot = await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(snapshot.ref);
            onSend({ image: imageURL });
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Image upload failed');
        }
    };

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/").pop();
        return `${userID}-${timeStamp}-${imageName}`;
    };

    const shareLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions.status !== 'granted') {
            Alert.alert('Permission denied', 'You need to grant permission to access the location.');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        onSend({
            location: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
            },
        });
    };

    return (
        <Button title="+" onPress={onActionPress} />
    );
};

export default CustomActions;
