import React, { useState } from 'react';
import { Button, Alert, ActivityIndicator } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { Blob } from 'blob-util';
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
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else {
                Alert.alert("Error occurred while fetching location");
            }
        } else {
            Alert.alert("Permissions haven't been granted.");
        }
    }

    const uploadAndSendImage = async (imageURI) => {
        setUploading(true);
        try {
            console.log('Image URI:', imageURI);
            if (!imageURI || !imageURI.path) {
                throw new Error('Invalid image URI');
            }
            if (!imageURI) {
                throw new Error('Image URI is missing or undefined.');
            }

            const uniqueRefString = generateReference(imageURI);
            if (!uniqueRefString) {
                throw new Error('Failed to generate reference for image.');
            }

            const newUploadRef = ref(storage, uniqueRefString);

            // Read the image file as base64 string
            const base64Image = await FileSystem.readAsStringAsync(imageURI, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log('Base64 Image:', base64Image); // Log the base64Image to check its value

            if (!base64Image) {
                throw new Error('Base64 image data is missing or empty.');
            }

            // Convert the base64 string to a blob using blob-util
            const blob = Blob.base64StringToBlob(base64Image);

            console.log('Blob:', blob); // Log the blob object to check its value

            if (!blob || typeof blob !== 'object' || !('path' in blob)) {
                throw new Error('Blob object is missing or invalid.');
            }

            // Upload the blob to Firebase Storage
            await uploadBytes(newUploadRef, blob);
            console.log('File has been uploaded successfully');

            // Get the download URL of the uploaded image
            const imageURL = await getDownloadURL(newUploadRef);
            // Send the image URL to onSend function
            onSend({ image: imageURL });
            setUploading(false);
        } catch (error) {
            console.error('Error in uploadAndSendImage:', error);
            setUploading(false);
            Alert.alert('Upload Error', 'Failed to upload image. Please try again later.');
        }
    };


    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                await uploadAndSendImage(result.assets[0].uri);
            } else {
                console.log("Error picking image:", result);
                Alert.alert("Error picking image");
            }
        } else {
            Alert.alert("Permissions haven't been granted.");
        }
    }

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                await uploadAndSendImage(result.assets[0].uri);
            } else {
                console.log("Error taking photo:", result);
                Alert.alert("Error taking photo");
            }
        } else {
            Alert.alert("Permissions haven't been granted.");
        }
    }

    const generateReference = (uri, user) => {
        try {
            if (!uri || typeof uri !== 'string') {
                throw new Error('Invalid image URI');
            }
            const timeStamp = new Date().getTime();
            const parts = uri.split('/');
            const imageName = parts[parts.length - 1];
            return `${user}-${timeStamp}-${imageName}`;
        } catch (error) {
            console.error('Error generating reference:', error);
            return null;
        }
    };

    return (
        <>
            <Button title="+" onPress={onActionPress} />
            {uploading && <ActivityIndicator />}
        </>
    );
}

export default CustomActions;