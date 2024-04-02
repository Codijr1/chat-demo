import React from 'react';
import { TouchableOpacity, View, Text, Alert, Button } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ onSend, storage, userID }) => {
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
        console.log("Image Picker Result:", result); // Log the result object
        if (!result.cancelled && result.uri) {
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
        console.log("Camera Result:", result);
        if (!result.cancelled && result.uri) {
            uploadAndSendImage(result.uri);
        } else {
            Alert.alert('Photo capture canceled');
        }
    };

    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();

        // Upload image to Firebase Storage
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref);
            await addDoc(collection(db, 'images'), { imageURL, createdAt: serverTimestamp() });
            onSend({ image: imageURL });
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
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
